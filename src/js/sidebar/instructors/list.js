/**
 * Instructors list component
 *
 * @since 1.0.0
 * @version [version]
 */


// External Deps.
import { findIndex } from 'lodash';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

// WP Deps.
import { useState } from '@wordpress/element';

// Internal Deps.
import ListItem from './list-item';

/**
 * Instructors list component
 *
 * @since [version]
 *
 * @param {Object}   props
 * @param {Object[]} props.instructors       Array of instructor objects.
 * @param {function} props.updateInstructors Callback function to update the parent component's state.
 * @param {function} props.removeInstructor  Callback function to remove an instructor to the parent component's state.
 * @param {function} props.updateInstructor  Callback function to update a single instructor in the parent component's state.
 * @return {Object} Component fragment.
 */
export default function( { instructors, updateInstructors, removeInstructor, updateInstructor }) {

	const [ isDragging, setIsDragging ] = useState( false ),
		sensors = useSensors(
		useSensor( PointerSensor ),
		useSensor( KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		} )
	);

	/**
	 * Drag start callback.
	 *
	 * Set's dragging state used for CSS classes.
	 *
	 * @since [version]
	 *
	 * @param {Object} event Event object.
	 * @return {void}
	 */
	function handleDragStart( event ) {
		setIsDragging( event.active.id );
	}

	/**
	 * Drag end callback.
	 *
	 * Reorders the instructor's list on drop & clears the dragging state.
	 *
	 * @since [version]
	 *
	 * @param {Object} event Event object.
	 * @return {void}
	 */
	function handleDragEnd( event ) {

		setIsDragging( false );

		const { active, over } = event;

		if ( active.id !== over.id ) {

			const oldIndex = findIndex( instructors, { id: active.id } ),
				newIndex = findIndex( instructors, { id: over.id } );

			updateInstructors( arrayMove( instructors, oldIndex, newIndex ) );

		}
	}

	return (
		<div>
			<DndContext
				sensors={ sensors }
				collisionDetection={ closestCenter }
				onDragStart= { handleDragStart }
				onDragEnd={ handleDragEnd }
				modifiers={ [  restrictToVerticalAxis, restrictToWindowEdges ] }
			>
				<SortableContext
					items={ instructors }
					strategy={ verticalListSortingStrategy }
				>
					{ instructors.map( ( instructor, index ) =>
						<ListItem
							isDragging={ ( instructor.id === isDragging ) }
							id={ instructor.id }
							key={ instructor.id }
							index={ index }
							instructor={ instructor }
							removeInstructor={ removeInstructor }
							updateInstructor={ updateInstructor }
						/>
					) }
				</SortableContext>
			</DndContext>
		</div>
	);
}
