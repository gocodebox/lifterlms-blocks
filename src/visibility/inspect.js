/**
 * Add visibility attributes to all blocks
 *
 * @since    1.0.0
 * @version  1.0.0
 */

// WP Deps.
const { __ } = wp.i18n;
const { createHigherOrderComponent } = wp.compose;
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const {
	PanelBody,
	PanelRow,
	SelectControl,
} = wp.components;

// External Deps.
import assign from 'lodash/assign';
import SearchPost from '../components/search-post';

// Internal Deps.
import Preview from './preview';

export default createHigherOrderComponent( ( BlockEdit ) => {

	return ( props ) => {

		const { attributes: {
			llms_visibility,
			llms_visibility_in,
		}, setAttributes } = props;

		let {
			llms_visibility_posts,
		} = props.attributes;

		if ( undefined === llms_visibility_posts ) {
			llms_visibility_posts = '[]'
		}

		llms_visibility_posts = JSON.parse( llms_visibility_posts );

		const getVisibilityInOptions = () => {

			const currentPost = wp.data.select( 'core/editor' ).getCurrentPost()

			let options = []

			if ( -1 !== [ 'course', 'lesson' ].indexOf( currentPost.type ) ) {
				options.push( { value: 'this', label: __( 'in this course', 'lifterlms' ) } )
			}

			options.push( { value: 'any_course', label: __( 'in any course', 'lifterlms' ) } )

			if ( -1 !== [ 'llms_membership' ].indexOf( currentPost.type ) ) {
				options.push( { value: 'this', label: __( 'in this membership', 'lifterlms' ) } )
			}

			options.push(
				{ value: 'any_membership', label: __( 'in any membership', 'lifterlms' ) },
				{ value: 'any', label: __( 'in any course or membership', 'lifterlms' ) },
				{ value: 'list_all', label: __( 'in all of the selected courses or memberships', 'lifterlms' ) },
				{ value: 'list_any', label: __( 'in any of the selected courses or memberships', 'lifterlms' ) }
			)

			return wp.hooks.applyFilters( 'llms_blocks_block_visibility_in_options', options, currentPost );

		}

		const getVisibilityInLabel = visibility => {
			if ( 'enrolled' === visibility ) {
				return __( 'Enrolled In', 'lifterlms' )
			}
			return __( 'Not Enrolled In', 'lifterlms' )
		}

		const onChange = ( post, event ) => {
			if ( 'select-option' === event.action ) {
				addPost( event.option );
			} else if ( 'remove-value' === event.action ) {
				delPost( event.removedValue );
			} else {
				console.log( event );
			}
		}

		const addPost = ( add ) => {
			if ( ! llms_visibility_posts.map( ( { id } ) => id ).includes( add.id ) ) {
				llms_visibility_posts.push( add );
			}
			savePosts();
		}

		const delPost = ( del ) => {
			llms_visibility_posts.splice( llms_visibility_posts.map( ( { id } ) => id ).indexOf( del.id ), 1 );
			savePosts();
		}

		const savePosts = () => {
			setAttributes( { llms_visibility_posts: JSON.stringify( llms_visibility_posts ) } )
		}


		return (
			<Fragment>
				<Preview {...props} />
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Enrollment Visibility', 'lifterlms' ) }>

						<SelectControl
							label={ __( 'Display to', 'lifterlms' ) }
							value={ llms_visibility }
							onChange={ value => setAttributes( { llms_visibility: value } ) }
							options={ [
								{ value: 'all', label: __( 'everyone', 'lifterlms' ) },
								{ value: 'enrolled', label: __( 'enrolled users', 'lifterlms' ) },
								{ value: 'not_enrolled', label: __( 'non-enrolled users or visitors', 'lifterlms' ) },
							] }
						/>


						{ 'all' !== llms_visibility && (
							<SelectControl
								label={ getVisibilityInLabel( llms_visibility ) }
								value={ llms_visibility_in }
								onChange={ value => setAttributes( { llms_visibility_in: value } ) }
								options={ getVisibilityInOptions() }
							/>
						) }

						{ 'all' !== llms_visibility && ( 'list_all' === llms_visibility_in || 'list_any' === llms_visibility_in ) && (

							<div>
								<SearchPost
									isMulti
									postType="course"
									label={ __( 'Courses', 'lifterlms' ) }
									placeholder={ __( 'Search by course title...', 'lifterlms' ) }
									onChange={ onChange }
									selected={ llms_visibility_posts.filter( post => 'course' === post.type ) }
								/>
								<SearchPost
									isMulti
									postType="llms_membership"
									label={ __( 'Memberships', 'lifterlms' ) }
									placeholder={ __( 'Search by memebership title...', 'lifterlms' ) }
									onChange={ onChange }
									selected={ llms_visibility_posts.filter( post => 'llms_membership' === post.type ) }
								/>
							</div>

						) }

					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl' );
