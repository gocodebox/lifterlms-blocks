/**
 * Add visibility attribute inspect and preview interfaces to qualifying blocks
 *
 * @since 1.0.0
 * @since 1.6.0 Import `InspectorControls` from `wp.blockEditor` in favor of deprecated `wp.editor`
 * @since 1.7.0 Import `InspectorControls` from `wp.blockEditor` and fallback to `wp.editor` to maintain backwards compatibility.
 * @version 1.8.0
 */

// WP Deps.
import { __ } from '@wordpress/i18n';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';

// External Deps.
import assign from 'lodash/assign';

// Internal Deps.
import check from './check';
import Preview from './preview';
import SearchPost from '../components/search-post';
import { options as visibilityOptions } from './settings';

/**
 * Block edit inspector controls for visibility settings
 *
 * @since 1.0.0
 * @since 1.1.0 Updated.
 * @since 1.5.1 Exits early for non LifterLMS dynamic blocks.
 * @since 1.6.0 Use `check()` helper to determine if the block supports visibility.
 *              Add "logged in" and "logged out" block visibility options.
 * @since 1.8.0 Fix issue causing visibility attributes to render on blocks that don't support them.
 */
export default createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		// Exit early if the block doesn't support visibility.
		if ( ! check( wp.blocks.getBlockType( props.name ), props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const {
			attributes: { llms_visibility, llms_visibility_in },
			setAttributes,
		} = props;

		let { llms_visibility_posts } = props.attributes;

		if ( undefined === llms_visibility_posts ) {
			llms_visibility_posts = '[]';
		}

		llms_visibility_posts = JSON.parse( llms_visibility_posts );

		/**
		 * Retrieve a filtered object of options for the "visibility" select control
		 *
		 * @return  obj
		 * @since   1.0.0
		 * @version 1.0.0
		 */
		const getVisibilityInOptions = () => {
			const currentPost = wp.data
				.select( 'core/editor' )
				.getCurrentPost();

			const options = [];

			if ( -1 !== [ 'course', 'lesson' ].indexOf( currentPost.type ) ) {
				options.push( {
					value: 'this',
					label: __( 'in this course', 'lifterlms' ),
				} );
			}

			options.push( {
				value: 'any_course',
				label: __( 'in any course', 'lifterlms' ),
			} );

			if ( -1 !== [ 'llms_membership' ].indexOf( currentPost.type ) ) {
				options.push( {
					value: 'this',
					label: __( 'in this membership', 'lifterlms' ),
				} );
			}

			options.push(
				{
					value: 'any_membership',
					label: __( 'in any membership', 'lifterlms' ),
				},
				{
					value: 'any',
					label: __( 'in any course or membership', 'lifterlms' ),
				},
				{
					value: 'list_all',
					label: __(
						'in all of the selected courses or memberships',
						'lifterlms'
					),
				},
				{
					value: 'list_any',
					label: __(
						'in any of the selected courses or memberships',
						'lifterlms'
					),
				}
			);

			return wp.hooks.applyFilters(
				'llms_blocks_block_visibility_in_options',
				options,
				currentPost
			);
		};

		/**
		 * Retrieve label text for the visibility "in" control.
		 *
		 * @param string  visibility value of the "visibility" control.
		 * @param visibility
		 * @return  string
		 * @since   1.0.0
		 * @version 1.0.0
		 */
		const getVisibilityInLabel = ( visibility ) => {
			if ( 'enrolled' === visibility ) {
				return __( 'Enrolled In', 'lifterlms' );
			}
			return __( 'Not Enrolled In', 'lifterlms' );
		};

		/**
		 * On change event callback for seaching specific posts.
		 *
		 * @param obj  post  WP_Post object.
		 * @param obj  event JS event obj.
		 * @param post
		 * @param event
		 * @return  void
		 * @since   1.0.0
		 * @version 1.0.0
		 */
		const onChange = ( post, event ) => {
			if ( 'select-option' === event.action ) {
				addPost( event.option );
			} else if ( 'remove-value' === event.action ) {
				delPost( event.removedValue );
			} else {
				console.log( event );
			}
		};

		/**
		 * On Change event callback for visibility select control
		 *
		 * Additionally updates the valued of "visibility in" to be the default value.
		 * Resolves an issue that causes the `in` value to not be stored because no change event is triggerd on the control.
		 *
		 * @param string  value setting value.
		 * @param value
		 * @return  void
		 * @since   1.1.0
		 * @version 1.1.0
		 */
		const onChangeVisibility = ( value ) => {
			setAttributes( {
				llms_visibility: value,
				llms_visibility_in: getVisibilityInOptions()[ 0 ].value,
			} );
		};

		/**
		 * Adds a post to the posts visibility attribute & saves.
		 *
		 * @param obj  add WP_Post.
		 * @param add
		 * @return  void
		 * @since   1.0.0
		 * @version 1.0.0
		 */
		const addPost = ( add ) => {
			if (
				! llms_visibility_posts
					.map( ( { id } ) => id )
					.includes( add.id )
			) {
				llms_visibility_posts.push( add );
			}
			savePosts();
		};

		/**
		 * Deletes a post from the posts visibility attribute & saves.
		 *
		 * @param obj  add WP_Post.
		 * @param del
		 * @return  void
		 * @since   1.0.0
		 * @version 1.0.0
		 */
		const delPost = ( del ) => {
			llms_visibility_posts.splice(
				llms_visibility_posts.map( ( { id } ) => id ).indexOf( del.id ),
				1
			);
			savePosts();
		};

		/**
		 * Save the current posts attribute state.
		 *
		 * @return  void
		 * @since   1.0.0
		 * @version 1.0.0
		 */
		const savePosts = () => {
			setAttributes( {
				llms_visibility_posts: JSON.stringify( llms_visibility_posts ),
			} );
		};

		return (
			<Fragment>
				<Preview { ...props }>
					<BlockEdit { ...props } />
				</Preview>
				<InspectorControls>
					<PanelBody
						title={ __( 'Enrollment Visibility', 'lifterlms' ) }
					>
						<SelectControl
							className="llms-visibility-select"
							label={ __( 'Display to', 'lifterlms' ) }
							value={ llms_visibility }
							onChange={ onChangeVisibility }
							options={ visibilityOptions }
						/>

						{ -1 ===
							[ 'all', 'logged_in', 'logged_out' ].indexOf(
								llms_visibility
							) && (
							<Fragment>
								<SelectControl
									className="llms-visibility-select--in"
									label={ getVisibilityInLabel(
										llms_visibility
									) }
									value={ llms_visibility_in }
									onChange={ ( value ) =>
										setAttributes( {
											llms_visibility_in: value,
										} )
									}
									options={ getVisibilityInOptions() }
								/>

								{ ( 'list_all' === llms_visibility_in ||
									'list_any' === llms_visibility_in ) && (
									<div>
										<SearchPost
											isMulti
											postType="course"
											label={ __(
												'Courses',
												'lifterlms'
											) }
											placeholder={ __(
												'Search by course title…',
												'lifterlms'
											) }
											onChange={ onChange }
											selected={ llms_visibility_posts.filter(
												( post ) =>
													'course' === post.type
											) }
										/>
										<SearchPost
											isMulti
											postType="llms_membership"
											label={ __(
												'Memberships',
												'lifterlms'
											) }
											placeholder={ __(
												'Search by membership title…',
												'lifterlms'
											) }
											onChange={ onChange }
											selected={ llms_visibility_posts.filter(
												( post ) =>
													'llms_membership' ===
													post.type
											) }
										/>
									</div>
								) }
							</Fragment>
						) }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withInspectorControl' );
