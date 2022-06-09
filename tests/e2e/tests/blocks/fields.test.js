import {
	clickBlockToolbarButton,
	getAllBlocks,
	insertBlock,
	selectBlockByClientId,
	showBlockToolbar,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	logoutUser,
	toggleOpenRegistration,
	visitPage,
	wpVersionCompare
} from '@lifterlms/llms-e2e-test-utils';

import {
	blockSnapshotMatcher,
	clickBlockToolbarOption,
	clearBlocks,
	convertBlockToReusable,
	visitForm,
	transformBlockTo,
} from '../../util';


const fieldSnapshotMatcher = {
	clientId: expect.any( String ),
};

const reusableBlockSnapshotMatcher = {
	...blockSnapshotMatcher,
	attributes: {
		ref: expect.any( Number ),
	},
};

/**
 * Adds isStackedOnMobile block attribute to blocks on WP 5.8 so our snapshots can
 * be taken for 5.9 and later.
 *
 * @since 2.4.3
 *
 * @param {Object} WP_Block objects.
 * @return {Object} Updated block.
 */
 function backportColumnAttrs( block ) {

	// On 5.8- snapshots fail because isStackedOnMobile didn't exist.
	if ( wpVersionCompare( '5.9', '<' ) ) {
		if ( 'core/columns' === block.name ) {
			block.attributes.isStackedOnMobile = true;
		}
	}

	return block;

}

/**
 * Utility function to retrieve the block being tested
 *
 * Before testing a block we clear all blocks so there will only ever
 * be a single block in the blocks list. This quickly pulls the list
 * and returns the first one.
 *
 * @since 2.0.0
 * @since 2.2.0 Automatically run a snapshot expectation.
 * @since 2.4.3 Account for columns new attributes introduced in 5.9.
 *
 * @param {?string} hint    Message to be passed as the toMatchSnapshot hint. If `null`, snapshot is skipped.
 * @param {Object}  matcher Snapshot matcher, defaults to `blocksSnapshotMatcher`.
 * @return {Object} A WP_Block object.
 */
async function getTestedBlock( hint = 'single block', matcher = blockSnapshotMatcher ) {

	const [ testedBlock ] = await getAllBlocks();

	if ( null !== hint ) {
		expect( backportColumnAttrs( testedBlock ) ).toMatchSnapshot( matcher, hint );
	}

	return testedBlock;
}

/**
 * Clear all blocks and add a fresh copy of the block to be tested
 *
 * @since 2.2.0
 *
 * @param {string} name Block name.
 * @return {void}
 */
async function setupTest( name ) {

	await clearBlocks();
	return await insertBlock( name );

}

/**
 * Run a snapshot expectation against the current tested block for a specific block attribute.
 *
 * @since 2.2.0
 *
 * @param {string} attributeName Block attribute name / key.
 * @return {void}
 */
async function expectBlockAttribute( attributeName ) {

	const { attributes } = await getTestedBlock( null );
	expect( attributes[ attributeName ] ).toMatchSnapshot();


}

async function getReusableBlockChildren( clientId ) {
	return await page.evaluate( async( _clientId ) =>
		wp.data.select( 'core/block-editor' ).getBlocks( _clientId ),
		clientId
	);
}


async function expectedField( fieldName, clientId, wp_59_compat = false ) {

	await page.waitFor( 500 );

	const field = await getField( fieldName );
	if ( wp_59_compat ) {
		field.data_store = false;
		field.data_store_key = false;
	}
	expect( field ).toMatchSnapshot( fieldSnapshotMatcher, 'single field' );
	expect( field.clientId ).toBe( clientId );

}

async function getLoadedBlocks() {
	return await page.evaluate( async() => {
		return wp.data.select( 'llms/user-info-fields' ).getLoadedFields();
	} );
}

async function getField( name ) {
	return await page.evaluate( ( _name ) => wp.data.select( 'llms/user-info-fields' ).getField( _name ), name );
}







/**
 * Expectations for converting a field to and from a group block.
 *
 * @since 2.2.0
 *
 * @param {Object} props
 * @param {string} props.name      Block name.
 * @param {string} props.fieldName Field name.
 * @return {void}
 */
async function testGroupTransforms( { name, fieldName } ) {

	// To a group.
	await transformBlockTo( 'Group', fieldName );
	const groupBlock = await getTestedBlock( 'group block' ),
		{ innerBlocks } = groupBlock;

	expect( innerBlocks[0] ).toMatchSnapshot( blockSnapshotMatcher, 'single block' );
	await expectedField( fieldName, innerBlocks[0].clientId );

	// Ungroup.
	await clickBlockToolbarOption( 'Ungroup' );
	const testedBlock = await getTestedBlock();

	expect( innerBlocks[0] ).toMatchSnapshot( blockSnapshotMatcher, 'single block' );
	await expectedField( fieldName, testedBlock.clientId );

}

/**
 * Expectations for converting a field to a columns block.
 *
 * @since 2.2.0
 *
 * @param {Object} props
 * @param {string} props.name      Block name.
 * @param {string} props.fieldName Field name.
 * @return {void}
 */
async function testTransformToColumns( { name, fieldName } ) {

	// To columns.
	await transformBlockTo( 'Columns', fieldName );
	const columnsBlock = await getTestedBlock( 'columns block' ),
		{ innerBlocks } = columnsBlock,
		columnBlock = innerBlocks[0],
		fieldBlock = columnBlock.innerBlocks[0];

	expect( columnBlock ).toMatchSnapshot( blockSnapshotMatcher, 'column block' );
	expect( fieldBlock ).toMatchSnapshot( blockSnapshotMatcher, 'single block' );
	await expectedField( fieldName, fieldBlock.clientId );

	// Reset the block (I don't want to figure out how to write a test to move the block out of the column).
	await setupTest( name );

}

/**
 * Expectations for converting a field to and from a reusable block.
 *
 * @since 2.2.0
 * @since 2.4.3 Account for Voucher Code special case in WP 5.9+.
 *
 * @param {Object} props
 * @param {string} props.name      Block name.
 * @param {string} props.fieldName Field name.
 * @return {void}
 */
async function testReusableTransforms( { name, fieldName } ) {

	// To a reusable block.
	await convertBlockToReusable( `Reusable: ${ fieldName }` );
	const reusableBlock = await getTestedBlock( 'reusable block', reusableBlockSnapshotMatcher );

	await page.waitFor( 1000 );

	const [ testedBlock ] = await getReusableBlockChildren( reusableBlock.clientId );

	await expectedField( fieldName, testedBlock.clientId, ( wpVersionCompare( 5.9 ) && 'Voucher Code' === name )  )
	expect( testedBlock ).toMatchSnapshot( blockSnapshotMatcher, 'single block' );

	// Reusable to static.
	await showBlockToolbar();
	await clickBlockToolbarButton( 'Convert to regular blocks' );

	await page.waitFor( 1000 );

	const staticBlock = await getTestedBlock( 'single block' );
	await expectedField( fieldName, staticBlock.clientId );

}

/**
 * Test modification of a field's label property.
 *
 * @since Unknown
 * @since 2.2.0 Replace existing label instead of adding to it.
 *              Don't run automatic snapshot tests when retrieving the tested block & use expectBlockAttribute().
 *
 * @return {void}
 */
async function testLabelProp() {

	const { clientId } = await getTestedBlock( null );

	const input = await page.$( `#block-${ clientId } label.rich-text` );
	await input.click( { clickCount: 3 } );
	await input.type( 'Custom Label' );
	await expectBlockAttribute( 'label' );

}
/**
 * Test modification of a field's description property.
 *
 * @since Unknown
 * @since 2.2.0 Don't run automatic snapshot tests when retrieving the tested block.
 *
 * @return {void}
 */
async function testDescriptionProp() {

	const { clientId } = await getTestedBlock( null );
	await page.type( `#block-${ clientId } span.rich-text`, 'Custom description' );
	await expectBlockAttribute( 'description' );

}

/**
 * Test modification of a field's description property.
 *
 * @since 2.2.0
 *
 * @return {void}
 */
async function testFieldColumnsProp() {

	const
		SELECTOR = '.llms-field-width-select select',
		OPTS     = await page.$$eval( `${ SELECTOR } option`, els => els.map( ( { value } ) => value ) );

	// Make sure the right options are available.
	expect( OPTS ).toEqual( [ '12', '9', '8', '6', '4', '3' ] );

	for ( let i = OPTS.length - 1; i >= 0; i-- ) {

		const cols = OPTS[ i ];
		await page.select( SELECTOR, cols );

		const { attributes } = await getTestedBlock( null );
		expect( attributes.columns ).toBe( parseInt( cols, 10 ) );

	}

}

/**
 * Test modification of a field's placeholder property.
 *
 * @since Unknown
 * @since 2.2.0 Don't run automatic snapshot tests when retrieving the tested block and select all input content prior to typing a custom placeholder.
 *
 * @param {Boolean} editable Whether or not the tested block's placeholder is editable.
 * @return {void}
 */
async function testPlaceholderProp( editable = true ) {

	const
		{ clientId } = await getTestedBlock( null ),
		selector     = `#block-${ clientId } input`;

	if ( editable ) {

		const input = await page.$( selector );
		await input.click( { clickCount: 3 } );
		await input.type( 'Custom Placeholder' );
		await expectBlockAttribute( 'placeholder' );

	} else {

		expect( await page.$eval( selector, el => el.disabled ) ).toBe( true );

	}
}

/**
 * Test modification of a field's required property.
 *
 * @since Unknown
 * @since 2.2.0 Don't run automatic snapshot tests when retrieving the tested block.
 *
 * @param {Boolean} editable Whether or not the tested block's placeholder is editable.
 * @return {void}
 */
async function testRequiredProp( editable = true ) {

	if ( editable ) {

		await click( '.llms-required-field-toggle label' );
		let { attributes } = await getTestedBlock( null );
		expect( attributes.required ).toBe( true );

		await click( '.llms-required-field-toggle label' );
		( { attributes } = await getTestedBlock( null ) );
		expect( attributes.required ).toBe( false );

	} else {

		expect( await page.evaluate( () => document.querySelector( '.llms-required-field-toggle' ) ) ).toBeNull();

	}

}

/**
 * Test the addition of a confirmation group to a single field block
 *
 * @since Unknown
 * @since 2.2.0 Add snapshot matcher hints.
 *
 * @param {Boolean} editable  Whether or not the block can be made into a confirm group.
 * @param {String}  fieldName Field name.
 * @return {void}
 */
async function testAddConfirmationProp( editable = true, fieldName = '' ) {

	if ( editable ) {

		await clickElementByText( 'Confirmation Field' );

		await page.waitFor( 2000 );

		const
			block = await getTestedBlock( null ),
			{ innerBlocks } = block;

		// Group.
		expect( block ).toMatchSnapshot( blockSnapshotMatcher, 'confirm group block' );

		// Main field.
		expect( innerBlocks[0] ).toMatchSnapshot( blockSnapshotMatcher, 'main field block' );

		// Confirm field.
		expect( innerBlocks[1] ).toMatchSnapshot( blockSnapshotMatcher, 'confirm field block' );

		// Test loading block via the llms/user-info-fields store.
		// Main field.
		const loadedField = await getField( fieldName );
		expect( loadedField ).toMatchSnapshot( fieldSnapshotMatcher, 'main field' );
		expect( loadedField.clientId ).toBe( innerBlocks[0].clientId );

		// Confirm field.
		const loadedConfirmField = await getField( `${fieldName}_confirm` );
		expect( loadedConfirmField ).toMatchSnapshot( fieldSnapshotMatcher, 'confirm field' );
		expect( loadedConfirmField.clientId ).toBe( innerBlocks[1].clientId );

	} else {
		expect( await page.evaluate( () => document.querySelector( '.llms-confirmation-field-toggle' ) ) ).toBeNull();
	}

}

/**
 * Test confirm group layout options and it's effect on inner blocks
 *
 * @since Unknown
 * @since 2.2.0 Add snapshot matcher hints.
 *
 * @return {void}
 */
async function testGroupLayout() {

	const { clientId } = await getTestedBlock( null );
	await selectBlockByClientId( clientId );

	const selections = [ 'Stacked', 'Columns' ];

	for ( let i = 0; i < selections.length; i++ ) {

		await clickElementByText( selections[ i ] );

		const
			block = await getTestedBlock( 'confirm group' ),
			{ innerBlocks } = block,
			[ mainBlock, confirmBlock ] = innerBlocks;

		expect( mainBlock ).toMatchSnapshot( blockSnapshotMatcher, 'main field block' );
		expect( confirmBlock ).toMatchSnapshot( blockSnapshotMatcher, 'confirm field block' );

	}

}

/**
 * Test removal of the confirmation group for a given field
 *
 * @since 2.2.0
 * @since 2.2.0 Use helper functions and add snapshot hints.
 *
 * @param {string} fieldName Block field name.
 * @return {void}
 */
async function testDelConfirmationProp( fieldName ) {

	await clickElementByText( 'Remove confirmation field' );

	const
		block = await getTestedBlock( 'single block' ),
		{ innerBlocks } = block;

	expect( innerBlocks ).toEqual( [] );

	await expectedField( fieldName, block.clientId );

	// Confirm field is gone.
	expect( await getField( `${ fieldName }_confirm` ) ).toBeNull();

}


/**
 * List of fields to run tests on.
 *
 * @since Unknown
 * @since 2.2.0 Added Voucher block.
 *
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
	{
		name: 'Voucher Code',
		confirmation: false,
		required: true,
		placeholder: true,
		fieldName: 'llms_voucher',
	},
].map( field => Object.assign( field, { toString: () => field.name } ) ); // Add a `toString()` function used by describe.each().

describe( 'Blocks/FormFields', () => {

	beforeAll( async () => {

		await visitForm();

	} );

	describe.each( fields )( '%s/Editor', ( field ) => {

		beforeAll( async () => {

			await setupTest( field.name );

		} );

		// Basic insertion.
		it ( 'can be created using the block inserter', async () => {

			// Test the block itself.
			const testedBlock = await getTestedBlock();

			// Test loading block via the llms/user-info-fields store.
			await expectedField( field.fieldName, testedBlock.clientId );

		} );

		// Transforms.
		it ( 'can be transformed to and from a group block', async () => await testGroupTransforms( field ) );
		it ( 'can be transformed to a columns block', async () => await testTransformToColumns( field ) );
		it( 'can be transformed to and from a reusable block', async () => await testReusableTransforms( field ) );

		// Block attributes.
		it ( 'can modify the label', async () => await testLabelProp() );
		it ( 'can modify the description', async () => await testDescriptionProp() );
		it ( 'can modify the field columns width', async() => await testFieldColumnsProp() )

		// Block attributes that can only be modified by certain blocks.
		if ( field.placeholder ) {
			it ( 'can modify the placeholder', async () => await testPlaceholderProp( true ) );
		} else {
			it ( 'cannot modify the placeholder', async () => await testPlaceholderProp( false ) );
		}
		if ( field.required ) {
			it ( 'can control the field required attribute', async () => await testRequiredProp( true ) );
		} else {
			it ( 'cannot control the required attribute', async () => await testRequiredProp( false ) );
		}

		// Confirmation group.
		if ( field.confirmation ) {
			it ( 'can add a confirmation field', async () => await testAddConfirmationProp( true, field.fieldName ) );
			it ( 'can toggle the group layout', async() => await testGroupLayout() );
			it ( 'can remove the confirmation field', async() => await testDelConfirmationProp( field.fieldName ) );
		} else {
			it ( 'cannot add a confirmation field', async () => await testAddConfirmationProp( false, field.fieldName ) );
		}

	} );

} );
