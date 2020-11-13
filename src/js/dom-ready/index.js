/**
 * Handle DOM Ready Events.
 *
 * @since 1.7.0
 * @version 1.7.0
 */

// WP Deps.
const { domReady } = wp;

// Internal Deps.
import formsReady from './forms-ready';
import { getCurrentPostType } from '../util/';



/**
 * On editor DOM ready.
 *
 * @since 1.6.0
 * @since 1.7.0 Refactor for simplicity.
 *
 * @return {void}
 */
domReady( () => {

	if ( 'llms_form' === getCurrentPostType() ) {
		formsReady();
	}

} );
