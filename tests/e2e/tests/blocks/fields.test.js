import {
	getAllBlocks,
	insertBlock,
} from '@wordpress/e2e-test-utils';

import {
	click,
	clickElementByText,
	logoutUser,
	toggleOpenRegistration,
	visitPage,
} from '@lifterlms/llms-e2e-test-utils';

import {
	clearBlocks,
	visitForm,
} from '../../util';

describe( 'Blocks/FormFields', () => {

	beforeAll( async () => {

		await visitForm();
		page.once( 'dialog', async dialog => await dialog.accept() ); // Leave page without saving.

	} );

	// Used to allow clientId and attributes.uuid to be any string in block object snapshots.
	const snapshotMatcher = {
		clientId: expect.any( String ),
		innerBlocks: expect.anything(),
		attributes: {
			uuid: expect.any( String )
		},
	};

	// List of tests to run.
	const tests = [
		{
			name: 'User Email',
			confirmation: true,
			required: false,
			placeholder: true,
		},
		{
			name: 'User Password',
			confirmation: true,
			required: false,
			placeholder: false,
		},
		{
			name: 'User Login',
			confirmation: true,
			required: false,
			placeholder: true,
		},
		{
			name: 'User Display Name',
			confirmation: false,
			required: false,
			placeholder: true,
		},
		{
			name: 'User Phone',
			confirmation: false,
			required: true,
			placeholder: true,
		}
	];

	let i = 0;
	while ( i < tests.length ) {

		const test = tests[i];

		describe( `${ test.name }/Editor`, () => {

			beforeAll( async () => {
				await clearBlocks();
				await insertBlock( test.name );
			} );

			it ( 'can be created using the block inserter', async () => {

				const blocks = await getAllBlocks();
				expect( blocks[0] ).toMatchSnapshot( snapshotMatcher );

			} );

			it ( 'can modify the label', async () => {

				let blocks = await getAllBlocks();
				await page.type( `#block-${ blocks[0].clientId } label.rich-text`, 'Custom Label ' );

				blocks = await getAllBlocks();

				expect( blocks[0].attributes.label ).toMatchSnapshot();

			} );

			if ( test.placeholder ) {

				it ( 'can modify the placeholder', async () => {

					let blocks = await getAllBlocks();
					await page.type( `#block-${ blocks[0].clientId } input`, 'Custom Placeholder' );

					blocks = await getAllBlocks();

					expect( blocks[0].attributes.placeholder ).toBe( 'Custom Placeholder' );

				} );

			} else {

				it ( 'cannot modify the placeholder', async () => {
					const blocks = await getAllBlocks();
					expect( await page.$eval( `#block-${ blocks[0].clientId } input`, el => el.disabled ) ).toBe( true );
				} );

			}


			it ( 'can modify the description', async () => {

				let blocks = await getAllBlocks();
				await page.type( `#block-${ blocks[0].clientId } span.rich-text`, 'Custom description' );

				blocks = await getAllBlocks();

				expect( blocks[0].attributes.description ).toBe( 'Custom description' );

			} );

			if ( test.confirmation ) {

				it ( 'can add a confirmation field', async () => {

					await clickElementByText( 'Confirmation Field' );

					const
						blocks = await getAllBlocks(),
						{ innerBlocks } = blocks[0];

					expect( blocks[0] ).toMatchSnapshot( {
						clientId: expect.any( String ),
						innerBlocks: expect.anything(),
					} );

					expect( innerBlocks[0] ).toMatchSnapshot( snapshotMatcher );
					expect( innerBlocks[1] ).toMatchSnapshot( snapshotMatcher );

				} );

			} else {

				it ( 'cannot add a confirmation field', async () => {

					expect( await page.evaluate( () => document.querySelector( '.llms-confirmation-field-toggle' ) ) ).toBeNull();

				} );

			}

			if ( test.required ) {

				it ( 'can control the field required attribute', async () => {

					await clickElementByText( 'Required' );
					let blocks = await getAllBlocks();
					expect( blocks[0].attributes.required ).toBe( true );

					await clickElementByText( 'Required' );
					blocks = await getAllBlocks();
					expect( blocks[0].attributes.required ).toBe( false );

				} );

			} else {

				it ( 'cannot control the required attribute', async () => {

					expect( await page.evaluate( () => document.querySelector( '.llms-required-field-toggle' ) ) ).toBeNull();

				} );

			}


		} );

		++i;
	}

} );
