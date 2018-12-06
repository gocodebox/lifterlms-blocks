/**
 * Instructors Area
 *
 * @since   1.0.0
 * @version 1.0.0
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

const DragHandle = SortableHandle( () => <span class="llms-drag-handle">:::</span> )

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

class Instructors extends Component {

	constructor() {

		super( ...arguments );

		this.state = {
			instructors: this.props.instructors || [],
			search: '',
		}

	}

	getRoles() {
		return wp.hooks.applyFilters( 'llms_instructor_roles', [
			'administrator',
			'lms_manager',
			'instructor',
			'instructors_assistant',
		] )
	}

	onSearchChange = ( result ) => {

		this.setState( {
			search: result,
		} );

	}

	getInstructorDefaults() {
		return wp.hooks.applyFilters( 'llms_instructor_defaults', {
			label: __( 'Author', 'lifterlms' ),
			visibility: 'visible',
		} )
	}

	updateInstructors = ( newInstructors ) => {
		this.setState( {
			instructors: newInstructors,
		} )
		this.props.updateInstructors( newInstructors );
	}

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

	removeInstructor = ( toRemove ) => {

		let { instructors } = this.state;

		instructors = instructors.filter( ( instructor, index ) => {
			return toRemove.id !== instructor.id;
		} )

		this.updateInstructors( instructors )

	}

	onFieldChange = ( key, val, index, instructor ) => {

		let { instructors } = this.state;

		instructors[ index ][ key ] = val;

		this.updateInstructors( instructors )

	}

	onSortEnd = ( { oldIndex, newIndex } ) => {

		this.updateInstructors( arrayMove( this.state.instructors, oldIndex, newIndex ) )

	};

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

// Get instructor data.
const applyWithSelect = withSelect( ( select ) => {
	const { getEditedPostAttribute } = select( 'core/editor' );
	return {
		instructors: getEditedPostAttribute( 'instructors' ),
	};
} );

// Update instructor data.
const applyWithDispatch = withDispatch( ( dispatch, { instructors } ) => {

	const { editPost } = dispatch( 'core/editor' );
	return {
		updateInstructors( instructors ) {
			editPost( { instructors: instructors } );
		},
	};

} );

export default compose( [
	applyWithSelect,
	applyWithDispatch
] )( Instructors );
