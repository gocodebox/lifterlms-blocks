/**
 * Handle DOM Ready Events.
 *
 * @since 1.7.0
 * @version 1.12.0
 */

// WP Deps.
import domReady from '@wordpress/dom-ready';
import { select, subscribe } from '@wordpress/data';

// Internal Deps.
import formsReady from './forms/';

/**
 * On editor DOM ready.
 *
 * @since 1.6.0
 * @since 1.7.0 Refactor for simplicity.
 * @since 1.12.0 Wait for current post to be setup before dispatching ready event.
 *
 * @return {void}
 */
domReady( () => {
	/**
	 * The unsubscribe seems to not run "fast" enough and we end up calling the formsReady() method twice
	 * when relying solely on unsubscribe(). Adding a boolean check appears to "fix" this "problem".
	 */
	let dispatched = false;

	const unsubscribe = subscribe( () => {
		const post = select( 'core/editor' ).getCurrentPost();
		if (
			false === dispatched &&
			0 !== Object.keys( post ).length &&
			'llms_form' === post.type
		) {
			dispatched = true;
			unsubscribe();
			formsReady();
		}
	} );
} );
