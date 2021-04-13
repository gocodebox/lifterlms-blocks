// WP deps.
import { dispatch, select } from '@wordpress/data';

// Exterenal deps.
import { find, isEmpty, merge } from 'lodash';

/**
 * Retrieve a list of field group blocks
 *
 * @since [version]
 *
 * @return {?Array.<Object>} Array of supporting block objects
 */
function getSupportingParents() {
	const { getBlockTypes, hasBlockSupport } = select( 'core/blocks' );
	return getBlockTypes().filter( ( block ) =>
		hasBlockSupport( block, 'llms_field_group' )
	);
}

/**
 * Retrieve the field group parent for a given block
 *
 * @since [version]
 *
 * @param {string} clientId The client ID of an existing block.
 * @return {Object} WP Block object of the parent.
 */
function getParentFieldGroup( clientId ) {
	const { getBlock, getBlockParentsByBlockName } = select(
		'core/block-editor'
	);
	return getBlock(
		getBlockParentsByBlockName(
			clientId,
			getSupportingParents().map( ( { name } ) => name )
		)
	);
}

/**
 * Retrieve the sibling block for a block in a field group
 *
 * @since [version]
 *
 * @param {string} clientId The client ID of an existing block.
 * @return {?Object} WP Block object of the sibling.
 */
function getSibling( clientId ) {
	const parent = getParentFieldGroup( clientId );
	return parent && parent.innerBlocks.length
		? find( parent.innerBlocks, ( block ) => block.clientId !== clientId )
		: null;
}

/**
 * Calculates the column value for a column's sibling
 *
 * This will ensure that the total of the blocks columns does not exceed 12
 * unless one of the two blocks is set to be full-width (12 columns).
 *
 * @since [version]
 *
 * @param {number} cols        Current block columns width.
 * @param {number} siblingCols Current sibling block columns width.
 * @return {number} Adjusted columns width for the sibling block.
 */
function determineSiblingCols( cols, siblingCols ) {
	if ( cols === 12 || siblingCols === 12 ) {
		siblingCols = 12;
	} else if ( cols + siblingCols > 12 ) {
		siblingCols = 12 - cols;
	}

	return siblingCols;
}

function isLastColumn( clientId ) {
	const parent = getParentFieldGroup( clientId );
	if ( parent && parent.innerBlocks.length ) {
		return (
			clientId ===
			parent.innerBlocks[ parent.innerBlocks.length - 1 ].clientId
		);
	}
}

function updateChildren( {
	setAttributes,
	currentUpdates,
	siblingClientId,
	siblingUpdates,
} = {} ) {
	const { updateBlockAttributes } = dispatch( 'core/block-editor' );

	/**
	 * Persist the staged updates.
	 *
	 * The setTimeout is bad but fixes no-op/memory leak.
	 *
	 * @see https://github.com/WordPress/gutenberg/issues/21049#issuecomment-632134201
	 */
	setTimeout( () => {
		if ( ! isEmpty( currentUpdates ) ) {
			setAttributes( currentUpdates );
		}

		if ( siblingClientId && ! isEmpty( siblingUpdates ) ) {
			updateBlockAttributes( siblingClientId, siblingUpdates );
		}
	} );
}

function getConfirmGroupUpdates( attributes, siblingAttributes ) {
	const currentUpdates = {},
		siblingUpdates = {};

	// Updates matching, id, & name fields.
	if ( attributes.isConfirmationControlField ) {
		const { name, id } = attributes,
			confirmName = `${ name }_confirm`,
			confirmId = `${ id }-confirm`;

		siblingUpdates.match = id;
		siblingUpdates.name = confirmName;
		siblingUpdates.id = confirmId;

		currentUpdates.match = confirmId;
	}

	// Sync required attribute between grouped fields.
	if ( attributes.required !== siblingAttributes.required ) {
		siblingUpdates.required = attributes.required;
	}

	// Sync the field variation type.
	if ( attributes.field !== siblingAttributes.field ) {
		siblingUpdates.field = attributes.field;
	}

	return {
		currentUpdates,
		siblingUpdates,
	};
}

export default function ( {
	attributes,
	context,
	clientId,
	setAttributes,
} = {} ) {
	const { columns } = attributes,
		sibling = getSibling( clientId );

	let currentUpdates = {},
		siblingUpdates = {};

	// When a preview is generated in the block switcher you don't have anything to work with here.
	if ( ! sibling ) {
		return;
	}

	const siblingClientId = sibling.clientId;

	// Syncing for confirm group fields.
	if (
		attributes.isConfirmationControlField ||
		attributes.isConfirmationField
	) {
		const groupUpdates = getConfirmGroupUpdates(
			attributes,
			sibling.attributes
		);

		currentUpdates = merge( currentUpdates, groupUpdates.currentUpdates );
		siblingUpdates = merge( siblingUpdates, groupUpdates.siblingUpdates );
	}

	// Updates columns based on group layout.
	siblingUpdates.columns = determineSiblingCols(
		columns,
		sibling.attributes.columns
	);

	if ( 'columns' === context[ 'llms/fieldGroup/fieldLayout' ] ) {
		const isLast = isLastColumn( clientId );

		currentUpdates.last_column = isLastColumn( clientId );
		siblingUpdates.last_column = ! isLast;
	} else {
		currentUpdates.last_column = true;
		siblingUpdates.last_column = true;
	}

	updateChildren( {
		setAttributes,
		currentUpdates,
		siblingClientId,
		siblingUpdates,
	} );
}
