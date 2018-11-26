const { __ } = wp.i18n;
const { Fragment } = wp.element
const {
	Button,
	PanelBody,
	PanelRow,
	TextControl,
	ToggleControl,
} = wp.components

import SearchUser from '../../components/search-user'

export default function Instructors( props ) {
	console.log( props );

	const roles = wp.hooks.applyFilters( 'llms_instructor_roles', [
		'administrator',
		'lms_manager',
		'instructor',
		'instructors_assistant',
	] )

	const { instructors } = llms.editorData;
	console.log( instructors );

	const onChange = ( results ) => {
		console.log( results );
	}

	const renderInstructorsList = () => (
		<ul class="llms-instructors">
			{ instructors.map( ( instructor ) => renderInstructor( instructor ) ) }
		</ul>
	)

	const renderInstructor = ( instructor ) => (
		<Fragment>
			<strong>{ instructor.name }</strong>
			<TextControl
				label={ __( 'Label', 'lifterlms' ) }
				value={ instructor.label }
			/>
			<ToggleControl
				label={ __( 'Visibile', 'lifterlms' ) }
			/>
		</Fragment>
	)

	return (
		<PanelBody
			title={ __( 'Instructors', 'lifterlms' ) }
		>
			<div>
				{ renderInstructorsList() }
			</div>
			<PanelRow>
				<div style={{ width: '80%' }}>
					<SearchUser
						roles={ roles }
						// label={ __( 'Instructors', 'lifterlms' ) }
						placeholder={ __( 'Search...', 'lifterlms' ) }
						onChange={ onChange }
					/>
				</div>
				<div>
					<Button isDefault>{ __( 'Add', 'lifterlms' ) }</Button>
				</div>
			</PanelRow>
		</PanelBody>
	)
}
