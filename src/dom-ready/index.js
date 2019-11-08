/**
 * Handle DOM Ready Events.
 *
 * @since [version]
 * @version [version]
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
 * @since [version] Refactor for simplicity.
 *
 * @return {void}
 */
domReady( () => {

	if ( 'llms_form' === getCurrentPostType() ) {
		formsReady();
	}

} );
