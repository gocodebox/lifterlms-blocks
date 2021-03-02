/**
 * Inspector Control to search the WP database for posts
 *
 * @since 1.0.0
 * @version [version]
 */

// WP Deps.
import { __, sprintf } from '@wordpress/i18n';

// Internal Deps.
import Search from '../search';

/**
 * Inspector Control to search the WP database for posts of a given type
 *
 * @since 1.0.0
 * @since[version] Updated to remove unnecessary overrides from Search in favor of atomic method usage.
 */
export default class SearchPost extends Search {
	/**
	 * Retrieve the default classname for the main Select element
	 *
	 * @since [version]
	 *
	 * @return {string} Class name to be used.
	 */
	getDefaultClassName = () =>
		`llms-search--${ this.props.postType.replace( 'llms_', '' ) }`;

	/**
	 * Retrieve the API request path used to perform the async search
	 *
	 * A custom searchPath can be passed in as a component property.
	 *
	 * @since [version]
	 *
	 * @return {string} API request path.
	 */
	getSearchPath = () =>
		this.props.searchPath || `/wp/v2/${ this.props.postType }`;

	/**
	 * Format the label displayed in search results.
	 *
	 * @since [version]
	 *
	 * @param {Object} result A post response object returned by the search api.
	 * @return {string} Label displayed for the search result item.
	 */
	formatSearchResultLabel = ( result ) =>
		sprintf(
			__( '%s (ID# %d)', 'lifterlms' ),
			result.title.rendered,
			result.id
		);
}
