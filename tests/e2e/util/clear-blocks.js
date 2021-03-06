import { pressKeyWithModifier } from '@wordpress/e2e-test-utils';

/**
 * Select all blocks in the editor and then delete them
 *
 * @since 1.12.0
 *
 * @return {Void}
 */
export default async () => {

	await pressKeyWithModifier( 'primary', 'a' );
	await page.keyboard.press( 'Backspace' );

};
