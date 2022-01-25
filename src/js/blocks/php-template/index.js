/**
 * BLOCK: llms/php-template
 *
 * @since [version]
 */

// WP deps.
import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Placeholder } from '@wordpress/components';

// Internal deps.
import Inspector from './inspect';
import getLabel from './get-label';

/**
 * Block Name.
 *
 * @type {string}
 */
export const name = 'llms/php-template';

/**
 * Register Block.
 *
 * @since [version]
 *
 * @param {string} name     Block name.
 * @param {Object} settings Block settings.
 * @return {Object} Block settings object.
 */
export const settings = {
	title: __( 'LifterLMS PHP Template', 'lifterlms' ),
	category: 'llms-blocks', // common, formatting, layout widgets, embed. see https://wordpress.org/gutenberg/handbook/block-api/#category.
	keywords: [ __( 'LifterLMS', 'lifterlms' ) ],
	attributes: {
		template: {
			type: 'string',
			default: '',
		},
		title: {
			type: 'string',
			default: '',
		},
		hideTitle: {
			type: 'boolean',
			default: false,
		},
	},
	supports: {
		html: false,
		multiple: false,
		reusable: false,
		inserter: false,
	},
	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 *
	 * This represents what the editor will render when the block is used.
	 * The "edit" property must be a valid function.
	 *
	 * @since [version]
	 *
	 * @param {Object} props Block properties.
	 * @return {Element} Edit component.
	 */
	edit: ( props ) => {
		const { attributes, setAttributes } = props,
			{ hideTitle, template } = attributes,
			blockProps = useBlockProps(),
			label = getLabel( template );

		return (
			<div { ...blockProps }>
				<Inspector { ...{ hideTitle, setAttributes } } />
				<Placeholder
					label={ label }
					className="wp-block-liftelrms-php-template__placeholder"
				>
					<div className="wp-block-liftelrms-php-template__placeholder-copy">
						<p className="wp-block-liftelrms-php-template__placeholder-warning">
							<strong>
								{ __(
									'Attention: Do not remove this block!',
									'lifterlms'
								) }
							</strong>{ ' ' }
							{ __(
								'Removal will cause unintended effects on your LMS site.',
								'lifterlms'
							) }
						</p>
						<p>
							{ sprintf(
								/* translators: %s is the template title */
								__(
									'This is an editor placeholder for the %s. On your site this will be replaced by the relevant template. You can move this placeholder around and add further blocks around it to extend the template.',
									'lifterlms'
								),
								label
							) }
						</p>
					</div>
				</Placeholder>
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @since [version]
	 *
	 * @return {null} Save function disabled for "dynamic" block.
	 */
	save: () => {
		return null;
	},
};
