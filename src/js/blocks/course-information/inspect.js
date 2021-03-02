/**
 * Inspector settings for the Course Information Block.
 *
 * @since 1.0.0
 * @version [version]
 */

// WP Dependencies.
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

/**
 * Inspector settings for the Course Information block.
 *
 * @since 1.0.0
 */
export default class Inspector extends Component {

	/**
	* Component renderer
	*
	* @since [version]
	*
	* @return {Fragment}
	*/
	render() {

		const {
			attributes: {
				length,
				show_cats,
				show_difficulty,
				show_length,
				show_tags,
				show_tracks,
				title_size,
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Course Information Options', 'lifterlms' ) }>

					<SelectControl
						label={ __( 'Title Headline Size', 'lifterlms' ) }
						value={ title_size }
						onChange={ value => setAttributes( { title_size: value } ) }
						help={ __( 'Headline size for the information title element.', 'lifterlms' ) }
						options={ [
							{ value: 'h1', label: 'h1' },
							{ value: 'h2', label: 'h2' },
							{ value: 'h3', label: 'h3' },
							{ value: 'h4', label: 'h4' },
							{ value: 'h5', label: 'h5' },
							{ value: 'h6', label: 'h6' },
						] }
					/>

					<TextControl
						label={ __( 'Estimated Completion Time', 'lifterlms' ) }
						value={ length }
						onChange={ value => setAttributes( { length: value } ) }
						help={ __( 'How many hours, days, weeks, etc... should a student expect to spend in order to complete this course.', 'lifterlms' ) }
					/>

					<ToggleControl
						label={ __( 'Display Estimated Time', 'lifterlms' ) }
						checked={ !! show_length }
						onChange={ value => setAttributes( { show_length: ! show_length } ) }
						help={ !! show_length ? __( 'Displaying estimated time', 'lifterlms' ) : __( 'Hiding estimated time', 'lifterlms' ) }
					/>

					<ToggleControl
						label={ __( 'Display Difficulty', 'lifterlms' ) }
						checked={ !! show_difficulty }
						onChange={ value => setAttributes( { show_difficulty: ! show_difficulty } ) }
						help={ !! show_difficulty ? __( 'Displaying difficulty', 'lifterlms' ) : __( 'Hiding difficulty', 'lifterlms' ) }
					/>

					<ToggleControl
						label={ __( 'Display Tracks', 'lifterlms' ) }
						checked={ !! show_tracks }
						onChange={ value => setAttributes( { show_tracks: ! show_tracks } ) }
						help={ !! show_tracks ? __( 'Displaying tracks list', 'lifterlms' ) : __( 'Hiding tracks list', 'lifterlms' ) }
					/>

					<ToggleControl
						label={ __( 'Display Categories', 'lifterlms' ) }
						checked={ !! show_cats }
						onChange={ value => setAttributes( { show_cats: ! show_cats } ) }
						help={ !! show_cats ? __( 'Displaying categories list', 'lifterlms' ) : __( 'Hiding categories list', 'lifterlms' ) }
					/>

					<ToggleControl
						label={ __( 'Display Tags', 'lifterlms' ) }
						checked={ !! show_tags }
						onChange={ value => setAttributes( { show_tags: ! show_tags } ) }
						help={ !! show_tags ? __( 'Displaying tags list', 'lifterlms' ) : __( 'Hiding tags list', 'lifterlms' ) }
					/>
				</PanelBody>

			</InspectorControls>
		);
	}
}
