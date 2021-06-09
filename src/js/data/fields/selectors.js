/**
 * Redux data store selectors
 *
 * @since [version]
 * @version [version]
 */

// Internal deps.
import { fieldsArrayToObject, fieldsObjectToArray } from './util';

/**
 * Determine if a field exists
 *
 * @since [version]
 *
 * @param {Object}   state        State tree.
 * @param {Object[]} state.fields Collection of user information fields.
 * @param {string}   name         Field name
 * @return {boolean} Returns `true` if the field exists and `false` otherwise.
 */
export function fieldExists( { fields }, name ) {
	return fields[ name ] ? true : false;
}

/**
 * Retrieve a field by name
 *
 * @since [version]
 *
 * @param {Object}   state        State tree.
 * @param {Object[]} state.fields Collection of user information fields.
 * @param {string}   name         Field name
 * @return {?Object} Returns the field object or `null` if not found.
 */
export function getField( { fields }, name ) {
	return fields[ name ] || null;
}

/**
 * Query fields by user-specified key/val pair
 *
 * @since [version]
 *
 * @param {Object} state     State tree.
 * @param {string} queryTerm Value used for searching.
 * @param {string} queryKey  Key name used for searching.
 * @param {string} context   Search context. Accepts 'global' to search all fields or 'local' to
 *                           search only currently loaded fields.
 * @return {?Object} Field object or `null` if not found.
 */
export function getFieldBy( state, queryTerm, queryKey, context = 'global' ) {
	const fields =
		'global' === context ? state.fields : getLoadedFields( state );
	return (
		fieldsObjectToArray( fields ).find(
			( field ) => field[ queryKey ] === queryTerm
		) || null
	);
}

/**
 * Returns registered user information fields.
 *
 * @param {Object}   state        State tree.
 * @param {Object[]} state.fields Collection of user information fields.
 * @return {Object[]} Collection of user information fields keyed by field `name` attribute.
 */
export function getFields( { fields } ) {
	return fields;
}

/**
 * Retrieve a reduced list of loaded fields
 *
 * A "loaded" field is a field which is connected to a field block in the current block editor instance.
 *
 * @since [version]
 *
 * @param {Object}   state        State tree.
 * @param {Object[]} state.fields Collection of user information fields.
 * @return {Object[]} Filtered collection of user information fields keyed by field `name` attribute.
 */
export function getLoadedFields( { fields } ) {
	const filtered = fieldsObjectToArray( fields ).filter(
		( { clientId } ) => clientId
	);
	return fieldsArrayToObject( filtered );
}

/**
 * Determine if a give field is a duplicate
 *
 * Duplicates are determined by comparing the name/clientId pair. If the clientId is different
 * than the stored clientId that means we're looking at a duplicate field.
 *
 * @since [version]
 *
 * @param {Object} state    State tree.
 * @param {string} name     Field name attribute.
 * @param {string} clientId WP Block client id.
 * @return {boolean} Returns `true` if the field is a duplicate or `false` if it's not a duplicate.
 */
export function isDuplicate( state, name, clientId ) {
	const field = getField( state, name );
	return field && field.clientId && field.clientId !== clientId
		? true
		: false;
}

/**
 * Determine if a given clientId is connected with a field
 *
 * @since [version]
 *
 * @param {Object} state    State tree.
 * @param {string} clientId WP Block client id.
 * @return {boolean} Returns `true` if the field is loaded and `false` if it is not.
 */
export function isLoaded( state, clientId ) {
	return getFieldBy( state, clientId, 'clientId', 'local' ) ? true : false;
}
