/**
 * "Form Settings" metabox locate in the "PluginDocumentSettingPanel" slot.
 *
 * Displays only on `llms_form` post types.
 *
 * @since 1.6.0
 * @version 1.6.0
 */

// WP Deps.
const
	{
		PanelRow,
		ToggleControl,
		createSlotFill
	}                              = wp.components,
	{ compose }                    = wp.compose,
	{
		select,
		withDispatch,
		withSelect,
	}                              = wp.data,
	{ PluginDocumentSettingPanel } = wp.editPost,
	{ Component, Fragment }        = wp.element,
	{ __ }                         = wp.i18n;


const { Fill, Slot } = createSlotFill( 'LLMSFormDocSettings' );

const LLMSFormDocSettings = ( { children } ) => (
	<Fill>
		{ children }
	</Fill>
);
LLMSFormDocSettings.Slot = Slot;
window.llms.plugins = window.llms.plugins || {};
window.llms.plugins.LLMSFormDocSettings = LLMSFormDocSettings;

/**
 * Render the "Form Settings" metabox in the "PluginDocumentSettingPanel" slot.
 *
 * @since 1.6.0
 */
class FormDocumentSettings extends Component {

	/**
	 * Constructor.
	 *
	 * @since 1.6.0
	 *
	 * @return {Void}
	 */
	constructor() {
		super( ...arguments );
	};

	// updateLocation = ( newLoc ) => {};

	/**
	 * Render the Sidebar.
	 *
	 * @since 1.6.0
	 *
	 * @return {Fragment}
	 */
	render = () => {

		if ( 'llms_form' !== select( 'core/editor' ).getCurrentPostType() ) {
			return null;
		}

		const
			{
				location,
				showTitle,
				setFormMetas,
			} = this.props,
			{ formLocations } = window.llms,
			currentLoc = formLocations[ location ];

		// Set default value.
		if ( '' === showTitle ) {
			setFormMetas( { _llms_form_show_title: 'yes' } );
		}

		return (
			<PluginDocumentSettingPanel
				name="llms-forms-doc-settings"
				title={ __( 'Form Settings', 'lifterlms' ) }
				opened={ true }
			>

	            <LLMSFormDocSettings.Slot>
	                { ( fills ) => (
	                    <Fragment>
							<PanelRow>
								<strong>{ __( 'Location', 'lifterlms' ) }</strong>
								<strong>{ currentLoc.name }</strong>
							</PanelRow>
							<p style={ { marginTop: '5px' } }><em>{ currentLoc.description }</em></p>
							{ fills }
							<br />
							<ToggleControl
								label={ __( 'Display Form Title', 'lifterlms' ) }
								checked={ 'yes' === showTitle }
								help={ 'yes' === showTitle ? __( 'Displaying form title.', 'lifterlms' ) : __( 'Not displaying form title.', 'lifterlms' ) }
								onChange={ val => setFormMetas( { _llms_form_show_title: val ? 'yes' : 'no' } ) }
							/>
	                    </Fragment>
	                ) }
	            </LLMSFormDocSettings.Slot>


			</PluginDocumentSettingPanel>
		);

    };

};

/**
 * Retrieve custom meta information when retrieving posts.
 *
 * @since 1.6.0
 */
const applyWithSelect = withSelect( ( select ) => {
	const { getEditedPostAttribute } = select( 'core/editor' );
	return {
		location: getEditedPostAttribute( 'meta' )._llms_form_location,
		showTitle: getEditedPostAttribute( 'meta' )._llms_form_show_title,
	};
} );

/**
 * Save custom meta information when saving posts.
 *
 * @since 1.6.0
 */
const applyWithDispatch = withDispatch( ( dispatch, { _llms_form_location } ) => {

	const { editPost } = dispatch( 'core/editor' );
	return {
		setFormMetas( metas ) {
			editPost( { meta: metas } );
		},
	};

} );

export default compose( [
	applyWithSelect,
	applyWithDispatch
] )( FormDocumentSettings );
