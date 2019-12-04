/**
 * Generic Field component
 *
 * @since 1.6.0
 * @version 1.6.0
 */

const
	{ RichText } = wp.blockEditor || wp.editor,
	{ __ }       = wp.i18n,
	{
		RawHTML,
		Component,
		Fragment
	} = wp.element;

import './editor.scss';

/**
 * Output a list of options for an input group field (checkbox/radio).
 *
 * @since 1.6.0
 *
 * @param {Object[]} options Array of options objects.
 * @param {String} fieldType Field node type (eg "checkbox" or "radio").
 * @return {Object} HTML Fragment.
 */
const InputGroupOptions = ( { options, fieldType } ) => {

	return (
		<Fragment>
			{ options.map( ( option, index ) => (
				<label key={ index } style={ { display: 'block', pointerEvents: 'none' } }>
					<input type={ fieldType } checked={ 'yes' === option.default } readOnly={ true } /> { option.text }
				</label>
			) ) }
		</Fragment>
	);
}

/**
 * Render a field in the block editor
 *
 * @since 1.6.0
 * @since [version] Add block editor rendering for password type fields.
 */
export default class Field extends Component {

	/**
	 * Determine the type of field.
	 *
	 * @since [version]
	 *
	 * @return {String}
	 */
	getFieldType() {

		const {
			attributes: {
				field,
			},
		} = this.props;

		if ( -1 !== [ 'email', 'text', 'number', 'url', 'tel' ].indexOf( field ) ) {
			return 'input';
		}

		return field;

	};

	/**
	 * Render the field.
	 *
	 * @since 1.6.0
	 * @since [version] Add rendering for password type fields.
	 *
	 * @return {Object} HTML Fragment.
	 */
  	render() {

		const
			{
				attributes: {
					id,
					description,
					field,
					label,
					options,
					placeholder,
					required,
					min_strength,
				},
				setAttributes,
			} = this.props;

		let classes = [];
		if ( required ) {
			classes.push( 'llms-is-required' );
		}

		const fieldType = this.getFieldType();

		/**
		 * Get the default option for a select field.
		 *
		 * @since 1.6.0
		 *
		 * @return {String}
		 */
		const getDefaultOption = () => {

			if ( placeholder ) {
				return placeholder;
			}

			if ( ! options.length ) {
				return '';
			}

			let text = options[0].text;

			const defaults = options.filter( opt => 'yes' === opt.default );

			if ( defaults.length ) {
				text = defaults[0].text;
			}

			return text;

		};

		return (
			<Fragment>
				<div className="llms-fields">
					<div className="llms-field">
						{ 'html' !== fieldType && (
							<RichText
								tagName="label"
								className={ classes.join( ' ' ) }
								value={ label }
								onChange={ ( val ) => {
									setAttributes( {
										label: val,
									} );
								} }
								formattingControls={ [ 'bold', 'italic' ] }
								aria-label={ label ? __( 'Field label' ) : __( 'Empty field label; start writing to add a label' ) }
								placeholder={ __( 'Enter a label' ) }
							/>
						) }
						{ 'input' === fieldType && (
							<input
								style={ { width: '100%' } }
								onChange={ event => setAttributes( { placeholder: event.target.value } ) }
								value={ placeholder }
								placeholder={ __( 'Add optional placeholder text', 'lifterlms' ) }
							/>
						) }
						{ 'password' === fieldType && (
							<input
								disabled="disabed"
								type="password"
								style={ { width: '100%' } }
								value="F4K3p4$50Rd"
							/>
						) }
						{ 'textarea' === fieldType && (
							<textarea
								style={ { width: '100%' } }
								onChange={ event => setAttributes( { placeholder: event.target.value } ) }
								value={ placeholder }
								placeholder={ __( 'Add optional placeholder text', 'lifterlms' ) }
							/>
						) }
						{ 'select' === fieldType && (
							<select style={ { width: '100%', maxWidth: 'none', pointerEvents: 'none' } }>
								<option>{ getDefaultOption() }</option>
							</select>
						) }
						{ 'llms-password-strength-meter' === id && (
							<div className="llms-pwd-meter"><div>{ __( 'Very Weak', 'lifterlms' ) }</div></div>
						) }
						<RichText
							tagName="span"
							value={ description }
							onChange={ ( val ) => {
								setAttributes( {
									description: val,
								} );
							} }
							formattingControls={ [ 'bold', 'strikethrough', 'link' ] }
							aria-label={ label ? __( 'Optional field description' ) : __( 'Empty field description; start writing to add a description' ) }
							placeholder={ __( 'Add optional description text' ) }
							style={ { color: '#808285', fontStyle: 'italic' } }
						/>
						{ ( 'radio' === fieldType || 'checkbox' === fieldType ) && (
							<InputGroupOptions options={ options } fieldType={ fieldType } />
						) }
					</div>
				</div>
			</Fragment>
		);

	}

}
