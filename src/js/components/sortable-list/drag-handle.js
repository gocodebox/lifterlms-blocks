// WP Deps.
import {
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// Internal Deps.
import DragHandle from '../../icons/drag-handle';

/**
 * Drag handle button component for use in sortable lists
 *
 * @since [version]
 *
 * @param {Object}   props
 * @param {string}   props.label      Helper text displayed in tooltip.
 * @param {function} props.setNodeRef Reference node setter, passed via dndkit.
 * @param {array}    props.listeners  Listener array, passed via dndkit.
 * @return {Button} Draghandle button component.
 */
export default function( { label, setNodeRef, listeners } ) {

	label = label || __( 'Reorder instructor', 'lifterlms' )

	return (
		<Button
			isSmall
			showTooltip
			label={ label }
			icon={ DragHandle }
			ref={ setNodeRef }
			className="llms-drag-handle"
			{ ...listeners }
		/>
	);

}
