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
	useSortable,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	SortableContext,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

// WP Deps.
import { useState } from '@wordpress/element';

// Internal Deps.
import DragHandle from '../../icons/drag-handle';

/**
 * Sortable List Item Compontent
 *
 * @since [version]
 *
 * @param {Object}  props
 * @param {Object}  props.ListItem      Component used to display each item in the sortable list.
 * @param {Object}  props.manageState   An object used to manage the state of the items in the list.
 *                                      Should contain 4 keys referencing functions: createItem, deleteItem, updateItem, updateItems.
 * @param {Boolean} props.dragHandle    If `true`, flags that the `ListItem` component will provide it's own drag handle and no innate drag functionality is provided.
 * @param {String}  props.itemClassName CSS classname applied to each ListItem.
 * @param {Object}  props.extraProps    Extra properties passed on to ListItem.
 * @param {mixed}   options.id          Item ID.
 * @param {Integer} options.index       Index of the item within the items list.
 * @param {Object}  options.item        Current item object.
 * @param {Boolean} options.isDragging  If `true`, the item is being dragged, useful for adding CSS for a different look during a drag event.
 * @return {Object} Component fragment.
 */
function SortableListItem( { id, index, item, isDragging, dragHandle, ListItem, itemClassName = '', manageState, extraProps = {} } ) {

	const {
			attributes,
			listeners,
			setNodeRef,
			transform,
			transition,
		} = useSortable( { id } ),
		style = {
			transform: CSS.Transform.toString( transform ),
			transition,
		};

	if ( isDragging && transform && transform.scaleX && transform.scaleY ) {
		transform.scaleX = 0.9;
		transform.scaleY = 0.9;
	}

	if ( isDragging ) {
		itemClassName += ' llms-is-dragging';
	}

	return (
		<div
			style={ style }
			ref={ dragHandle ? undefined : setNodeRef }
			className={ itemClassName }
			{ ...attributes }
			{ ...( dragHandle ? {} : listeners ) }
		>
			<ListItem
				id={ id }
				item={ item }
				index={ index }
				isDragging={ isDragging }
				setNodeRef={ setNodeRef }
				listeners={ listeners }
				manageState={ manageState }
				extraProps={ extraProps }
			/>
		</div>
	);

}

/**
 * Component for a rending a sortable list
 *
 * @since [version]
 *
 * @param {Object}   props
 * @param {Object}   props.ListItem         Component used to display each item in the sortable list.
 * @param {Object}   props.manageState      An object used to manage the state of the items in the list.
 *                                          Should contain 4 keys referencing functions: createItem, deleteItem, updateItem, updateItems.
 * @param {Object[]} props.items            Array of item objects. Each item *must* contain an unique `id` property.
 * @param {Object}   props.sortableStrategy Sortable strategy passed to DndContext.
 * @param {Array}    props.ctxModifiers     Context modifieds, passed to DndContext.
 * @param {Boolean}  props.dragHandle       If `true`, flags that the `ListItem` component will provide it's own drag handle and no innate drag functionality is provided.
 * @param {String}   props.itemClassName    CSS classname applied to each ListItem.
 * @param {Object}   props.extraProps       Extra properties passed on to ListItem.
 * @return {DndContext} Drag and drop context component.
 */
export default function( {
	ListItem,
	manageState,
	items = [],
	sortableStrategy = verticalListSortingStrategy,
	ctxModifiers = [ restrictToVerticalAxis, restrictToWindowEdges ],
	dragHandle = true,
	itemClassName = '',
	extraProps = {},
} ) {

	const [ isDragging, setIsDragging ] = useState( false ),
		sensors = useSensors(
			useSensor( PointerSensor ),
			useSensor( KeyboardSensor, {
				coordinateGetter: sortableKeyboardCoordinates,
			} )
		);


	function handleDragStart( event ) {
		setIsDragging( event.active.id );
	}

	function handleDragEnd( event ) {
		setIsDragging( false );

		const { active, over } = event;

		if ( active.id !== over.id ) {

			const oldIndex = findIndex( items, { id: active.id } ),
				newIndex = findIndex( items, { id: over.id } );

			manageState.updateItems( arrayMove( items, oldIndex, newIndex ) );

		}

	}

	return (
		<DndContext
			sensors={ sensors }
			collisionDetection={ closestCenter }
			onDragStart={ handleDragStart }
			onDragEnd={ handleDragEnd }
			modifiers={ ctxModifiers }
		>
			<SortableContext
				items={ items }
				strategy={ sortableStrategy }
			>
				{ items.map( ( item, index ) =>
					<SortableListItem
						id={ item.id }
						key={ item.id }
						index={ index }
						item={ item }
						isDragging={ ( item.id === isDragging ) }
						dragHandle={ dragHandle }
						ListItem={ ListItem }
						itemClassName={ itemClassName }
						manageState={ manageState }
						extraProps={ extraProps }
					/>
				) }
			</SortableContext>
		</DndContext>
	);

}
