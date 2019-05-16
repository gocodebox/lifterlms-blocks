/**
 * Course Information Block.
 *
 * @since 1.0.0
 * @since [version] Add supported post type settings.
 */

// Import CSS.
import './style.scss';
import './editor.scss';

// Import Inspector.
import Inspector from './inspect'

// Import Previews.
import PreviewTerms from './preview-terms'

const { RichText } = wp.editor
const { Fragment } = wp.element
const { __ } = wp.i18n;

/**
 * Block Name
 * @type {String}
 */
export const name = 'llms/course-information'

/**
 * Array of supported post types.
 *
 * @type {Array}
 */
export const post_types = [ 'course' ];

/**
 * Register: Course Information Block
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @since   1.0.0
 * @version 1.0.0
 */
export const settings = {
	title: __( 'Course Information', 'lifterlms' ),
	icon: {
		foreground: '#2295ff',
		src: 'list-view',
	},
	category: 'llms-blocks', // common, formatting, layout widgets, embed. see https://wordpress.org/gutenberg/handbook/block-api/#category.
	keywords: [
		__( 'LifterLMS', 'lifterlms' ),
	],

	attributes: {
		title: {
			type: 'string',
			default: __( 'Course Information', 'lifterlms' ),
		},
		title_size: {
			type: 'string',
			default: 'h3',
		},
		length: {
			type: 'string',
			default: '',
			source: 'meta',
			meta: '_llms_length',
		},
		show_cats: {
			type: 'boolean',
			default: true,
		},
		show_difficulty: {
			type: 'boolean',
			default: true,
		},
		show_length: {
			type: 'boolean',
			default: true,
		},
		show_tags: {
			type: 'boolean',
			default: true,
		},
		show_tracks: {
			type: 'boolean',
			default: true,
		},
	},

	supports: {
		multiple: false,
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 * @param   {Object} props Block properties.
	 * @return  {Function}
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	edit: props => {

		const { attributes, setAttributes } = props
		const {
			length,
			show_cats,
			show_difficulty,
			show_length,
			show_tags,
			show_tracks,
			title,
			title_size,
		} = attributes

		const currentPost = wp.data.select( 'core/editor' ).getCurrentPost()

		const showTitle = ( show_length || show_difficulty || show_tracks || show_cats || show_tags )

		return (
			<Fragment>
				<Inspector { ...{ attributes, setAttributes } } />
				<div className={ props.className }>
					{ showTitle && (
						<RichText
							tagName={ title_size }
							value={ title }
							onChange={ value => setAttributes( { title: value } ) }
						/>
					) }
					<ul>
						{ show_length && length && (
							<li><strong>{ __( 'Estimated Time', 'lifterlms' ) }</strong>: { length }</li>
						) }
						{ show_difficulty && ( <PreviewTerms { ...{
							currentPost,
							taxonomy: 'course_difficulty',
							taxonomy_name: __( 'Difficulty', 'lifterlms' ),
						} } /> ) }
						{ show_tracks && ( <PreviewTerms { ...{
							currentPost,
							taxonomy: 'course_track',
							taxonomy_name: __( 'Tracks', 'lifterlms' ),
						} } /> ) }
						{ show_cats && ( <PreviewTerms { ...{
							currentPost,
							taxonomy: 'course_cat',
							taxonomy_name: __( 'Categories', 'lifterlms' ),
						} } /> ) }
						{ show_tags && ( <PreviewTerms { ...{
							currentPost,
							taxonomy: 'course_tag',
							taxonomy_name: __( 'Tags', 'lifterlms' ),
						} } /> ) }
					</ul>
				</div>
			</Fragment>
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
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	save: () => {
		return null;
	}

}
