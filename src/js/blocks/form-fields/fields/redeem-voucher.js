/**
 * BLOCK: llms/form-field-redeem-voucher
 *
 * @since 1.6.0
 * @since 1.8.0 Updated lodash imports.
 */

// WP Deps.
import { ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

// External Deps.
import { cloneDeep } from 'lodash';

// Internal Deps.
import { settings as textSettings } from './text';

/**
 * Block Name
 *
 * @type {string}
 */
const name = 'llms/form-field-redeem-voucher';

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
const postTypes = [ 'llms_form' ];

/**
 * Is this a default or composed field?
 *
 * Composed fields serve specific functions (like the User Email Address field)
 * and are automatically added to the form builder UI.
 *
 * Default (non-composed) fields can be added by developers to perform custom functions
 * and are not registered as a block by default
 *
 * @type {string}
 */
const composed = true;

// Setup the field settings.
const settings = cloneDeep( textSettings );

settings.title = __( 'Voucher Redemption', 'lifterlms' );
settings.description = __(
	'A special field used to redeem a voucher code.',
	'lifterlms'
);

settings.icon.src = 'tickets-alt';

settings.supports.multiple = false;

settings.supports.llms_field_inspector.id = false;
settings.supports.llms_field_inspector.name = false;
settings.supports.llms_field_inspector.match = false;
settings.supports.llms_field_inspector.customFill = 'redeemVoucher';

settings.attributes.id.__default = 'llms_voucher';
settings.attributes.label.__default = __( 'Have a voucher?', 'lifterlms' );
settings.attributes.name.__default = 'llms_voucher';
settings.attributes.placeholder.__default = __( 'Voucher Code', 'lifterlms' );

settings.attributes.toggleable = {
	type: 'boolean',
	__default: false,
};

/**
 * Fill the controls slot with additional controls specific to this field.
 *
 * @since 1.6.0
 *
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes Reference to the block's setAttributes() function.
 * @return {Fragment} Component HTML fragment.
 */
settings.fillInspectorControls = ( attributes, setAttributes ) => {
	const { toggleable, required } = attributes;

	if ( required ) {
		return null;
	}

	return (
		<Fragment>
			<ToggleControl
				label={ __( 'Toggleable', 'lifterlms' ) }
				checked={ !! toggleable }
				onChange={ () => setAttributes( { toggleable: ! toggleable } ) }
				help={
					!! toggleable
						? __(
								'Field is revealed when the toggle is clicked.',
								'lifterlms'
						  )
						: __( 'Field is always visible.', 'lifterlms' )
				}
			/>
		</Fragment>
	);
};

export { name, postTypes, composed, settings };
