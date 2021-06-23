/**
 * Single instructor compontent
 *
 * @since [version]
 * @version [version]
 */

// External Deps.
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// WP Deps.
import {
	Button,
	Dashicon,
	IconButton,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
	Tooltip,
} from '@wordpress/components';
import { addQueryArgs } from '@wordpress/url';
import { __, sprintf } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

// Internal Deps.
import DragHandle from '../../icons/drag-handle';

/**
 * Instructor list item component
 *
 * @since [version]
 *
 * @param {Object} props Component properties object.
 * @return {Object} Component fragment.
 */
export default function( props ) {

	const { id, instructor, removeInstructor, updateInstructor, isDragging, index } = props,
		{ visibility, name, label } = instructor,
		visible = 'visible' === visibility,
		{
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
		} = useSortable( { id } ),
		style = {
			transform: CSS.Transform.toString( transform ),
			transition,
		},
		[ isEditing, setIsEditing ] = useState( false ),
		isPrimary = 0 === index;

	if ( isDragging && transform && transform.scaleX && transform.scaleY ) {
		transform.scaleX = 0.9;
		transform.scaleY = 0.9;
	}

	let className = 'llms-instructor';
	if ( isDragging ) {
		className += ' llms-is-dragging';
	}

	return (
		<div style={ style } { ...attributes } className={ className }>
			<div className="llms-instructor--header">
				<section>
					<strong>{ name }</strong>
					<small>(#{ id })</small>
				</section>
				<aside>
					{ isPrimary && (
						<Tooltip text={ __( 'Primary Instructor', 'lifterlms' ) }>
							<Dashicon icon="star-filled" />
						</Tooltip>
					) }
					<Button
						isSmall
						showTooltip
						label={ __( 'Reorder instructor', 'lifterlms' ) }
						icon={ DragHandle }
						ref={ setNodeRef }
						className="llms-drag-handle"
						{ ...listeners }
					/>
					<Button
						isSmall
						showTooltip
						label={ __( 'Edit instructor', 'lifterlms' ) }
						icon={ isEditing ? 'arrow-up-alt2' : 'arrow-down-alt2' }
						onClick={ () => setIsEditing( ! isEditing ) }
					/>
				</aside>
			</div>
			{ isEditing && (
				<div className="llms-instructor--settings">
					<ToggleControl
						label={ __( 'Visibility', 'lifterlms' ) }
						help={
							visible
								? __(
										'Instructor is visible on frontend',
										'lifterlms'
								  )
								: __(
										'Instructor is hidden on frontend',
										'lifterlms'
								  )
						}
						checked={ visible }
						onChange={ ( val ) => updateInstructor(
							id,
							{
								'visibility': val ? 'visible' : 'hidden',
							}
						) }
					/>
					{ visible && (
						<TextControl
							label={ __( 'Label', 'lifterlms' ) }
							value={ label }
							onChange={ ( label ) => updateInstructor( id, { label } ) }
						/>
					) }
					<Button
						isSecondary
						iconPosition="right"
						href={ addQueryArgs( '/wp-admin/user-edit.php', {
							user_id: id,
						} ) }
						target="_blank"
						rel="noreferrer"
						style={ { marginRight: '5px' } }
					>
						{ __( 'Edit', 'lifterlms' ) }
						<Dashicon icon="external" />
					</Button>
					{ ! isPrimary && (
						<Button
							isDestructive
							onClick={ () => removeInstructor( instructor ) }
							>
							{ __( 'Remove', 'lifterlms' ) }
						</Button>
					) }
				</div>
			) }
		</div>
	);
}
