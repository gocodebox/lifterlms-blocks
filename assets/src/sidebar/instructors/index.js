/**
 * Instructors Sidebar Plugin
 *
 * @since 1.0.0
 * @version 1.7.1
 */

// WP deps.
const {
	BaseControl,
	Button,
	IconButton,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} = wp.components
const {
	compose,
} = wp.compose
const {
	withDispatch,
	withSelect,
} = wp.data;
const {
	Component,
	Fragment
} = wp.element
const {
	__,
	sprintf,
} = wp.i18n;
const {
	addQueryArgs,
} = wp.url

// Internal Deps.
import SearchUser from '../../components/search-user'
import './editor.scss'

// External Deps.
import {
	arrayMove,
	SortableContainer,
	SortableElement,
	SortableHandle,
} from 'react-sortable-hoc';

/**
 * Output a Drag Handle.
 *
 * @since 1.0.0
 * @since 1.0.0 Use `className` instead of `class`.
 *
 * @return {Object} HTML Fragment.
 */
const DragHandle = SortableHandle( () => <span className="llms-drag-handle">:::</span> )

/**
 * Output a sortable list of instructors
 *
 * @since 1.0.0
 *
 * @return {Object} HTML Fragment.
 */
const InstructorsList = SortableContainer( ( { items, onChange, onRemove } ) => {
	return (
		<ul>
			{ items.map( ( instructor, index ) => (
				<InstructorsItem
					key={ `item-${index}` }
					index={ index }
					i={ index }
					instructor={ instructor }
					onChange={ onChange }
					onRemove={ onRemove }
				/>
			) ) }
		</ul>
	)
} )

/**
 * Output a single instructor list item.
 *
 * @since 1.0.0
 *
 * @return {Object} HTML Fragment.
 */
const InstructorsItem = SortableElement( ( { instructor, i, onChange, onRemove } ) => {
	const visible = ( 'visible' === instructor.visibility );
	return (
		<li class="llms-instructor">
			<BaseControl>
				<DragHandle />
				<strong>
					{ instructor.name }
					<a href={ addQueryArgs( '/wp-admin/user-edit.php', { user_id: instructor.id } ) } target="_blank">({ sprintf( __( 'ID: %d', 'lifterlms' ), instructor.id ) })</a>
				</strong>
				<IconButton
					style={ { float: 'right' } }
					icon="dismiss"
					label={ __( 'Remove Instructor', 'lifterlms' ) }
					onClick={ () => { onRemove( instructor ) } }
				/>
			</BaseControl>
			<ToggleControl
				label={ __( 'Visibility', 'lifterlms' ) }
				help={ visible ? __( 'Instructor is visible on frontend', 'lifterlms' ) : __( 'Instructor is hidden on frontend', 'lifterlms' ) }
				checked={ visible }
				onChange={ ( val ) => onChange( 'visibility', val ? 'visible' : 'hidden', i, instructor ) }
			/>
			{ visible && (
				<TextControl
					label={ __( 'Label', 'lifterlms' ) }
					value={ instructor.label }
					onChange={ ( val ) => onChange( 'label', val, i, instructor ) }
				/>
			) }
		</li>
	)
} )

/**
 * Instructors Sidebar Plugin Component
 *
 * @since 1.0.0
 * @since 1.7.1 Fix WordPress 5.3 issues with JSON data.
 */
class Instructors extends Component {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 * @since 1.7.1 Parse instructor data if it's stored as a JSON string.
	 *
	 * @return {void}
	 */
	constructor() {

		super( ...arguments );

		let { instructors } = this.props;
		instructors = 'string' === typeof instructors ? JSON.parse( instructors ) : instructors;

		this.state = {
			instructors: instructors || [],
			search: '',
		}

	}

	/**
	 * Retrieve a list of WordPress roles that are allowed to be listed as an instructor.
	 *
	 * @since 1.0.0
	 *
	 * @return {Array}
	 */
	getRoles() {
		return wp.hooks.applyFilters( 'llms_instructor_roles', [
			'administrator',
			'lms_manager',
			'instructor',
			'instructors_assistant',
		] )
	}

	/**
	 * Change event for the search box.
	 *
	 * Updates the "search" state parameter with search results.
	 *
	 * @since 1.0.0
	 *
	 * @param {Array} result Array of instructor data objects.
	 * @return {void}
	 */
	onSearchChange = ( result ) => {
		this.setState( {
			search: result,
		} );
	}

	/**
	 * Retrieve default instructor information.
	 *
	 * @since 1.0.0
	 *
	 * @return {Object}
	 */
	getInstructorDefaults() {
		return wp.hooks.applyFilters( 'llms_instructor_defaults', {
			label: __( 'Author', 'lifterlms' ),
			visibility: 'visible',
		} )
	}

	/**
	 * Update instructors list in the state and persist to the database via WP core data dispatcher.
	 *
	 * @since 1.0.0
	 *
	 * @param {Array} newInstructors Array of instructor data objects.
	 * @return {void}
	 */
	updateInstructors = ( newInstructors ) => {
		this.setState( {
			instructors: newInstructors,
		} )
		this.props.updateInstructors( newInstructors );
	}

	/**
	 * Add a new instructor from the selected search result.
	 *
	 * @since 1.0.0
	 *
	 * @return {void}
	 */
	addInstructor = () => {

		const { search } = this.state
		let { instructors } = this.state;

		instructors.push( Object.assign( this.getInstructorDefaults(), {
			id: search.id,
			name: search._user.name,
		} ) );

		this.updateInstructors( instructors );

		this.setState( {
			'search': '',
		} );

	}

	/**
	 * Remove an instructor
	 *
	 * @since 1.0.0
	 *
	 * @param {Object} toRemove Instructor data object of the instructor to remove.
	 * @return {void}
	 */
	removeInstructor = ( toRemove ) => {

		let { instructors } = this.state;

		instructors = instructors.filter( ( instructor, index ) => {
			return toRemove.id !== instructor.id;
		} )

		this.updateInstructors( instructors )

	}

	/**
	 * Change event when an individual instructor property changes.
	 *
	 * @since 1.0.0
	 *
	 * @param {String} key Property key.
	 * @param {mixed} val Property value.
	 * @param {Integer} index Index of the instructor that's being updated.
	 * @param {Object} instructor Instructor data object.
	 * @return {void}
	 */
	onFieldChange = ( key, val, index, instructor ) => {

		let { instructors } = this.state;

		instructors[ index ][ key ] = val;

		this.updateInstructors( instructors )

	}

	/**
	 * Callback function when instructor sortable list finishes being sorted.
	 *
	 * @since 1.0.0
	 *
	 * @param {Integer} oldIndex Previous index.
	 * @param {Integer} newIndex New index.
	 * @return {void}
	 */
	onSortEnd = ( { oldIndex, newIndex } ) => {
		this.updateInstructors( arrayMove( this.state.instructors, oldIndex, newIndex ) )
	};

	/**
	 * Render the component.
	 *
	 * @since 1.0.0
	 *
	 * @return {Object} HTML Fragment.
	 */
	render = () => (
		<PanelBody
			title={ __( 'Instructors', 'lifterlms' ) }
		>
			<PanelRow>
				<div style={{ width: '80%' }}>
					<SearchUser
						roles={ this.getRoles() }
						placeholder={ __( 'Search...', 'lifterlms' ) }
						onChange={ this.onSearchChange }
					/>
				</div>
				<div>
					<Button
						isDefault
						disabled={ ! this.state.search }
						onClick={ this.addInstructor }
					>{ __( 'Add', 'lifterlms' ) }</Button>
				</div>
			</PanelRow>
			<InstructorsList
				items={ this.state.instructors }
				onSortEnd={ this.onSortEnd }
				useDragHandle={ true }
				helperClass={ 'llms-instructor-sort-helper' }
				onChange={ this.onFieldChange }
				onRemove={ this.removeInstructor }
			/>
		</PanelBody>
	)
}

/**
 * Add instructors property to the post during data selection.
 *
 * @since 1.0.0
 *
 * @param {Object} select Reference to wp.data.select.
 * @return {Object}
 */
const applyWithSelect = withSelect( ( select ) => {
	const { getEditedPostAttribute } = select( 'core/editor' );
	return {
		instructors: getEditedPostAttribute( 'instructors' ),
	};
} );

/**
 * Add instructors property to the post durinp data selection.
 *
 * @since 1.0.0
 * @since 1.7.1 Dispatch instructors list as a JSON string.
 *
 * @param {Object} dispatch Reference to wp.data.dispatch.
 * @param {Array} instructors Array of instructor data objects.
 * @return {Object}
 */
const applyWithDispatch = withDispatch( ( dispatch, { instructors } ) => {

	const { editPost } = dispatch( 'core/editor' );
	return {
		updateInstructors( instructors ) {
			editPost( { instructors: JSON.stringify( instructors ) } );
		},
	};

} );

/**
 * Compose the component with the data select and dispatch properties.
 *
 * @since 1.0.0
 */
export default compose( [
	applyWithSelect,
	applyWithDispatch
] )( Instructors );
