/**
 * Ensure required fields are present on a form per location definitions
 *
 * @since [version]
 * @version [version]
 */

// External deps.
import { debounce, differenceWith } from 'lodash';

// WP Deps.
import { sprintf, _n, __ } from '@wordpress/i18n';
import { dispatch, select, subscribe } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { store as editorStore } from '@wordpress/editor';
import { store as noticesStore } from '@wordpress/notices';
import { store as blockEditorStore } from '@wordpress/block-editor';

// Internal deps.
import {
	getBlocksFlat,
	getCurrentFormLocationData,
	isPostEmpty,
} from '../../util/';
import { store as fieldsStore } from '../../data/fields';

let hasError = false;
const ERROR_ID = 'llms-form-missing-required-fields';

/**
 * Retrieves the text to use in an error notice based on the currently missing fields list
 *
 * @since [version]
 *
 * @param {Object[]} missingFields Missing fields object list.
 * @return {void}
 */
function getErrorMessage( missingFields ) {
	const { getField } = select( fieldsStore );

	let fieldsString = missingFields
		.map( ( { fieldName } ) => {
			const { label } = getField( fieldName );
			return label;
		} )
		.join( ', ' );

	// If we have 2 or more missing fields add "and" for the last item in the list.
	if ( missingFields.length >= 2 ) {
		fieldsString = fieldsString.replace(
			/,([^,]*)$/,
			sprintf(
				// Translators: %1$s = A comma or an empty string depending on how many fields are present; $2$s = final missing field label.
				__( '%1$s and %2$s', 'lifterlms' ),
				missingFields.length >= 3 ? ',' : '',
				'$1'
			)
		);
	}

	return sprintf(
		// Translators: %s = list of required field labels.
		_n(
			'The %s field is required. Please restore the field to save the form.',
			'The %s fields are required. Please restore these fields to save the form.',
			missingFields.length,
			'lifterlms'
		),
		fieldsString
	);
}

/**
 * Retrieves a list of missing fields
 *
 * @since [version]
 *
 * @return {Object[]} missingFields Missing fields object list.
 */
function getMissingFields() {
	const locationData = getCurrentFormLocationData();
	if ( ! locationData ) {
		return [];
	}

	const { required } = locationData;

	if ( isPostEmpty() ) {
		// Empty post.
		return required;
	}

	const { getLoadedFields } = select( fieldsStore ),
		loadedFields = Object.values( getLoadedFields() ),
		blocks = getBlocksFlat().filter(
			( { name } ) => 0 === name.indexOf( 'llms/form-' )
		);

	if ( blocks.length !== loadedFields.length ) {
		// Not loaded yet, don't pop message .
		return [];
	}

	return differenceWith(
		required,
		loadedFields,
		( { fieldName }, { name } ) => fieldName === name
	);
}

/**
 * Restores the missing fields
 *
 * This is the onClick callback for the action added to the error notice.
 *
 * @since [version]
 *
 * @param {Object[]} missingFields Missing fields object list.
 * @return {void}
 */
function restoreMissingFields( missingFields ) {
	const { insertBlocks } = dispatch( blockEditorStore ),
		{ getField } = select( fieldsStore ),
		blocksToInsert = missingFields.map( ( { fieldName, blockName } ) => {
			const atts = getField( fieldName );
			delete atts.clientId;
			delete atts.isPersisted;
			return createBlock( blockName, atts );
		} );
	insertBlocks( blocksToInsert, 0 );
}

/**
 * Handles creation/display of an error notice containing information about the missing fields
 *
 * @since [version]
 *
 * @param {Object[]} missingFields Missing fields object list.
 * @return {void}
 */
function showErrorNotice( missingFields ) {
	const { createErrorNotice } = dispatch( noticesStore ),
		{ lockPostSaving } = dispatch( editorStore );

	lockPostSaving( ERROR_ID );

	createErrorNotice( getErrorMessage( missingFields ), {
		id: ERROR_ID,
		isDismissible: false,
		actions: [
			{
				label: _n(
					'Restore missing field?',
					'Restore missing fields?',
					missingFields.length,
					'lifterlms'
				),
				onClick: () => restoreMissingFields( missingFields ),
			},
		],
	} );
}

/**
 * Watches the field list to determine if the required fields are missing
 *
 * If fields are missing, sets an error and shows the error notice.
 *
 * If there is a previously set error and no fields are missing, cleans up
 * previous errors.
 *
 * @since [version]
 *
 * @return {void}
 */
function watchFields() {
	const missingFields = getMissingFields();

	if ( missingFields.length ) {
		hasError = true;
		showErrorNotice( missingFields );
	} else if ( hasError ) {
		const { unlockPostSaving } = dispatch( editorStore ),
			{ removeNotice } = dispatch( noticesStore );

		removeNotice( ERROR_ID );
		unlockPostSaving( ERROR_ID );
		hasError = false;
	}
}

/**
 * Main subscription functions
 *
 * @since [version]
 *
 * @return {void}
 */
export default function () {
	// Make sure this starts after the blocksWatcher() subscription.
	setTimeout( () => {
		subscribe( debounce( watchFields ), 500 );
	}, 2500 );
}
