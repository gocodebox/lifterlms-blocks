import {
	getAllBlocks,
	insertBlock,
	selectBlockByClientId,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	logoutUser,
	toggleOpenRegistration,
	visitPage,
} from '@lifterlms/llms-e2e-test-utils';

import {
	blockSnapshotMatcher,
	clearBlocks,
	visitForm,
	maybeSkipFormsTests,
} from '../../util';


const fieldSnapshotMatcher = {
	clientId: expect.any( String ),
};

/**
 * Utility function to retrieve the block being tested
 *
 * Before testing a block we clear all blocks so there will only ever
 * be a single block in the blocks list. This quickly pulls the list
 * and returns the first one.
 *
 * @since 2.0.0
 *
 * @return {Object} A WP_Block object.
 */
async function getTestedBlock() {
	const blocks = await getAllBlocks();
	return blocks[0];
}

async function getLoadedBlocks() {
	return await page.evaluate( async() => {
		return wp.data.select( 'llms/user-info-fields' ).getLoadedFields();
	} );
}

async function getField( name ) {
	return await page.evaluate( ( _name ) => wp.data.select( 'llms/user-info-fields' ).getField( _name ), name );
}

async function testLabelProp() {

	const { clientId } = await getTestedBlock();
	await page.type( `#block-${ clientId } label.rich-text`, 'Custom Label ' );

	const { attributes } = await getTestedBlock();
	expect( attributes.label ).toMatchSnapshot();

}

async function testDescriptionProp() {

	const { clientId } = await getTestedBlock();
	await page.type( `#block-${ clientId } span.rich-text`, 'Custom description' );

	const { attributes } = await getTestedBlock();
	expect( attributes.description ).toMatchSnapshot();

}

async function testFieldColumns() {

	const
		selector = '.llms-field-width-select select',
		opts     = await page.$$eval( `${ selector } option`, els => els.map( ( { value } ) => value ) );

	// Make sure the right options are available.
	expect( opts ).toEqual( [ '12', '9', '8', '6', '4', '3' ] );

	for ( let i = opts.length - 1; i >= 0; i-- ) {

		const cols = opts[ i ];
		await page.select( selector, cols );

		const { attributes } = await getTestedBlock();
		expect( attributes.columns ).toBe( parseInt( cols, 10 ) );

	}

}

async function testPlaceholderProp( editable = true ) {

	const
		{ clientId } = await getTestedBlock(),
		selector     = `#block-${ clientId } input`;

	if ( editable ) {
		await page.type( selector, 'Custom Placeholder' );

		const { attributes } = await getTestedBlock();
		expect( attributes.placeholder ).toMatchSnapshot();

	} else {

		expect( await page.$eval( selector, el => el.disabled ) ).toBe( true );

	}
}

async function testAddConfirmationProp( editable = true, fieldName = '' ) {

	if ( editable ) {

		await clickElementByText( 'Confirmation Field' );

		await page.waitFor( 2000 );

		const
			block = await getTestedBlock(),
			{ innerBlocks } = block;

		// Group.
		expect( block ).toMatchSnapshot( blockSnapshotMatcher );

		// Main field.
		expect( innerBlocks[0] ).toMatchSnapshot( blockSnapshotMatcher );

		// Confirm field.
		expect( innerBlocks[1] ).toMatchSnapshot( blockSnapshotMatcher );

		// Test loading block via the llms/user-info-fields store.
		await page.waitFor( 1000 ); // Waiting for subscription watcher to catch up.

		// Main field.
		const loadedField = await getField( fieldName );
		expect( loadedField ).toMatchSnapshot( fieldSnapshotMatcher );
		expect( loadedField.clientId ).toBe( innerBlocks[0].clientId );

		// Confirm field.
		const loadedConfirmField = await getField( `${fieldName}_confirm` );
		expect( loadedConfirmField ).toMatchSnapshot( fieldSnapshotMatcher );
		expect( loadedConfirmField.clientId ).toBe( innerBlocks[1].clientId );

	} else {
		expect( await page.evaluate( () => document.querySelector( '.llms-confirmation-field-toggle' ) ) ).toBeNull();
	}

}

async function testDelConfirmationProp( fieldName ) {

	await clickElementByText( 'Remove confirmation field' );

	const
		block = await getTestedBlock(),
		{ innerBlocks } = block;

	expect( block ).toMatchSnapshot( blockSnapshotMatcher );
	expect( innerBlocks ).toEqual( [] );

	// Test field data.
	await page.waitFor( 1000 ); // Waiting for subscription watcher to catch up.
	const loadedField = await getField( fieldName );
	expect( loadedField ).toMatchSnapshot( fieldSnapshotMatcher );
	expect( loadedField.clientId ).toBe( block.clientId );

	// Confirm field is gone.
	expect( await getField( `${ fieldName }_confirm` ) ).toBeNull();

}

async function testGroupLayout() {

	const { clientId } = await getTestedBlock();
	await selectBlockByClientId( clientId );

	const selections = [ 'Stacked', 'Columns' ];

	for ( let i = 0; i < selections.length; i++ ) {

		await clickElementByText( selections[ i ] );

		const
			block = await getTestedBlock(),
			{ innerBlocks } = block;

		expect( block ).toMatchSnapshot( blockSnapshotMatcher );

		expect( innerBlocks[0] ).toMatchSnapshot( blockSnapshotMatcher );
		expect( innerBlocks[1] ).toMatchSnapshot( blockSnapshotMatcher );
	}

}

async function testRequiredProp( editable = true ) {

	if ( editable ) {

		await click( '.llms-required-field-toggle label' );
		let { attributes } = await getTestedBlock();
		expect( attributes.required ).toBe( true );

		await click( '.llms-required-field-toggle label' );
		( { attributes } = await getTestedBlock() );
		expect( attributes.required ).toBe( false );

	} else {
		expect( await page.evaluate( () => document.querySelector( '.llms-required-field-toggle' ) ) ).toBeNull();
	}

}



// List of fields to run tests on.
const fields = [
	{
		name: 'User Email',
		confirmation: true,
		required: false,
		placeholder: true,
		fieldName: 'email_address',
	},
	{
		name: 'User Password',
		confirmation: true,
		required: false,
		placeholder: false,
		fieldName: 'password',
	},
	{
		name: 'User Login',
		confirmation: true,
		required: false,
		placeholder: true,
		fieldName: 'user_login',
	},
	{
		name: 'User Display Name',
		confirmation: false,
		required: false,
		placeholder: true,
		fieldName: 'display_name',
	},
	{
		name: 'User Phone',
		confirmation: false,
		required: true,
		placeholder: true,
		fieldName: 'llms_phone',
	},

	/**
	 * @todo Build a set of recursive tests to run all tests against each block within
	 *       a group of blocks.
	 *
	 * Add tests for Name & Address blocks that are made up entirely of innerBlocks
	 *
	 * Additionally the same set of tests for label, description, etc... should be run
	 * against confirmation fields.
	 *
	 * Additional custom tests should be written for custom properties on the password field (meter toggling, length, and meter desc.).
	 *
	 * Additional tests should be run on the frontend too, maybe? Although this maybe redundant, assuming the phpunit tests
	 * properly test output we shouldn't have to additionally write E2E tests to test the output of the field data...
	 */
];

describe( 'Blocks/FormFields', () => {

	maybeSkipFormsTests();

	beforeAll( async () => {

		await visitForm();
		page.once( 'dialog', async dialog => await dialog.accept() ); // Leave page without saving.

	} );


	let i = 0;
	while ( i < fields.length ) {

		const field = fields[i];

		describe( `${ field.name }/Editor`, () => {

			beforeAll( async () => {
				await clearBlocks();
				await insertBlock( field.name );
			} );

			it ( 'can be created using the block inserter', async () => {

				// Test the block itself.
				const testedBlock = await getTestedBlock();
				expect( testedBlock ).toMatchSnapshot( blockSnapshotMatcher );

				// Test loading block via the llms/user-info-fields store.
				await page.waitFor( 1000 ); // Waiting for subscription watcher to catch up.
				const loadedField = await getField( field.fieldName );
				expect( loadedField ).toMatchSnapshot( fieldSnapshotMatcher );
				expect( loadedField.clientId ).toBe( testedBlock.clientId );

			} );

			it ( 'can modify the label', async () => await testLabelProp() );
			it ( 'can modify the description', async () => await testDescriptionProp() );
			it ( 'can modify the field columns width', async() => await testFieldColumns() )

			if ( field.placeholder ) {
				it ( 'can modify the placeholder', async () => await testPlaceholderProp( true ) );
			} else {
				it ( 'cannot modify the placeholder', async () => await testPlaceholderProp( false ) );
			}

			if ( field.confirmation ) {
				it ( 'can add a confirmation field', async () => await testAddConfirmationProp( true, field.fieldName ) );
				it ( 'can toggle the group layout', async() => await testGroupLayout() );
				it ( 'can remove the confirmation field', async() => await testDelConfirmationProp( field.fieldName ) );
			} else {
				it ( 'cannot add a confirmation field', async () => await testAddConfirmationProp( false, field.fieldName ) );
			}

			if ( field.required ) {
				it ( 'can control the field required attribute', async () => await testRequiredProp( true ) );
			} else {
				it ( 'cannot control the required attribute', async () => await testRequiredProp( false ) );
			}

		} );

		++i;
	}

} );
