/**
 * Output a list of checkbox or radio options
 *
 * @since [version]
 * @version [version]
 */

// WP deps.
import { withInstanceId } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';

/**
 * Output a list of options for an input group field (checkbox/radio).
 *
 * @since 1.6.0
 * @since [version] Moved out of `field.js` to it's own file and added an instance id.
 *
 * @param {Object}   options
 * @param {Object[]} options.options    Array of options objects.
 * @param {string}   options.fieldType  Field node type (eg "checkbox" or "radio").
 * @param {number}   options.instanceId Unique component instanceId.
 * @return {Object} HTML Fragment.
 */
function InputOptionsGroup( { options, fieldType, instanceId } ) {
	return (
		<Fragment>
			{ options.map( ( option, index ) => (
				<label
					htmlFor={ `llms-${ fieldType }-${ instanceId }-${ index }` }
					key={ index }
					style={ { display: 'block', pointerEvents: 'none' } }
				>
					<input
						id={ `llms-${ fieldType }-${ instanceId }-${ index }` }
						type={ fieldType }
						checked={ 'yes' === option.default }
						readOnly={ true }
					/>{ ' ' }
					{ option.text }
				</label>
			) ) }
		</Fragment>
	);
}

export default withInstanceId( InputOptionsGroup );
