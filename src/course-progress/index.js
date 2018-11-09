/**
 * BLOCK: lifterlms-blocks
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

// Import CSS.
import './style.scss';
import './editor.scss';

const { __, setLocaleData } = wp.i18n;
const { registerBlockType } = wp.blocks;

// setLocaleData( window.LLMS.l10n.strings, 'lifterlms' );

/**
 * Register: Course Progress Block
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully, registered; otherwise `undefined`.
 * @since   [version]
 * @version [version]
 */
export default registerBlockType( 'llms/course-progress', {
	title: __( 'Course Progress', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'chart-area'
	},
	category: 'common', // common, formatting, layout widgets, embed. see https://wordpress.org/gutenberg/handbook/block-api/#category.
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
	],

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 * @since   [version]
	 * @version [version]
	 */
	edit: function( props ) {
		// Creates a <div class='wp-block-llms-course-progress'></div>.
		return (
			<div className={ props.className }>
				<div class="progress-bar" value="50" max="100">
					<div class="progress--fill"></div>
				</div>
				<span>50%</span>
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 * @since   [version]
	 * @version [version]
	 */
	save: function( props ) {
		return (
			<div>
				[lifterlms_course_progress]
			</div>
		);
	},
} );
