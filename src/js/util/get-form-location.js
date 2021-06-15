/**
 * Retrieve information about form locations
 *
 * @since [version]
 * @version [version]
 */

// External deps.
import { select } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Retrieve the form location id of the current form
 *
 * @since [version]
 *
 * @return {string} The ID of the current form's lcation
 */
export function getCurrentFormLocation() {
	const { getCurrentPost } = select( editorStore ),
		{ meta = {} } = getCurrentPost();

	return meta._llms_form_location || null;
}

/**
 * Retrieve the form location data object for the given form.
 *
 * @since [version]
 *
 * @return {?Object} Returns the location definition object or `null` if it doesn't exist.
 */
export function getCurrentFormLocationData() {
	return getFormLocationData( getCurrentFormLocation() );
}

/**
 * Retrieve form location data object for a give form by id
 *
 * @since [version]
 *
 * @param {string} id Form location ID.
 * @return {?Object} Returns the location definition object or `null` if it doesn't exist.
 */
export function getFormLocationData( id ) {
	const { formLocations } = window.llms;
	return formLocations[ id ] ? formLocations[ id ] : null;
}
