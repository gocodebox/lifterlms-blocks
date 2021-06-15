/**
 * Redux data store actions
 *
 * @since [version]
 * @version [version]
 */

/**
 * Add a field
 *
 * @since [version]
 *
 * @param {Object} field Field definition.
 * @return {Object} Action object.
 */
export function addField( field ) {
	return {
		type: 'ADD_FIELD',
		field,
	};
}

/**
 * Delete a field
 *
 * @since [version]
 *
 * @param {string} name Field name.
 * @return {Object} Action object.
 */
export function deleteField( name ) {
	return {
		type: 'DELETE_FIELD',
		name,
	};
}

/**
 * Edit a field
 *
 * @since [version]
 *
 * @param {string} name  Field name.
 * @param {Object} edits Field object.
 * @return {Object} Action object.
 */
export function editField( name, edits ) {
	return {
		type: 'EDIT_FIELD',
		name,
		edits,
	};
}

/**
 * Load a field
 *
 * Stores the clientId of the associated block.
 *
 * @since [version]
 *
 * @param {string} name     Field name.
 * @param {string} clientId The WP Block's clientId of the associated block.
 * @return {Object} Action object.
 */
export function loadField( name, clientId ) {
	return {
		type: 'EDIT_FIELD',
		name,
		edits: { clientId },
	};
}

/**
 * Unload a field
 *
 * Removes the stored clientId of the associated block.
 *
 * @since [version]
 *
 * @param {string} name Field name.
 * @return {Object} Action object.
 */
export function unloadField( name ) {
	return {
		type: 'EDIT_FIELD',
		name,
		edits: { clientId: null },
	};
}

/**
 * Receive an array of field data
 *
 * @since [version]
 *
 * @param {Object[]} fields Array of field objects.
 * @return {Object} Action object.
 */
export function receiveFields( fields ) {
	return {
		type: 'RECEIVE_FIELDS',
		fields,
	};
}

/**
 * Rename a field
 *
 * Changes the `name` attribute.
 *
 * @since [version]
 *
 * @param {string} oldName Current/old name of the field.
 * @param {string} newName New name of the field.
 * @return {Object} Action object.
 */
export function renameField( oldName, newName ) {
	return {
		type: 'RENAME_FIELD',
		oldName,
		newName,
	};
}

/**
 * Reset fields to the default state
 *
 * @since [version]
 *
 * @return {Object} Action object.
 */
export function resetFields() {
	return {
		type: 'RESET_FIELDS',
	};
}
