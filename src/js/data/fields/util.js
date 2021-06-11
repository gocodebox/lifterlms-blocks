/**
 * Redux data store utility functions
 *
 * @since [version]
 * @version [version]
 */

/**
 * Convert an array of user information fields to an object keyed by globally unique `name` attribute.
 *
 * @since [version]
 *
 * @param {Object[]} fields Array of field objects.
 * @return {Object} Object of field objects.
 */
export function fieldsArrayToObject( fields ) {
	return fields.reduce(
		( obj, currentField ) => ( {
			...obj,
			[ currentField.name ]: currentField,
		} ),
		{}
	);
}

/**
 * Convert an object of field objects into an array
 *
 * Useful for running array functions like filter.
 *
 * @since [version]
 *
 * @param {Object} fields Object of user information field objects.
 * @return {Object[]} Array of user information field objects.
 */
export function fieldsObjectToArray( fields ) {
	return Object.values( fields );
}
