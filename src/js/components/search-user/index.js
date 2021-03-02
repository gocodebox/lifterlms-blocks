/**
 * Inspector Control to search the WP database for posts
 *
 * @since 1.0.0
 * @version [version]
 */

// WP Deps.
import {
	__,
	sprintf,
} from '@wordpress/i18n';

// Internal Deps.
import Search from '../search';

export default class SearchUser extends Search {

	/**
	 * Retrieve the default classname for the main Select element
	 *
	 * @since [version]
	 *
	 * @return {String} Class name to be used.
	 */
	getDefaultClassName = () => 'llms-search--user';

	/**
	 * Generates an object of arguments appended to the search URL.
	 *
	 * Merges the searchArgs property with default arguments and the search string.
	 *
	 * @since [version]
	 *
	 * @param {String} search Search string, this will be included in the arguments as the `search` property.
	 * @return {Object} Object of arguments to add to the search API request.
	 */
	getSearchArgs( search ) {

		let args = super.getSearchArgs( search );

		const { roles } = this.props;
		if ( roles ) {
			args.roles = Array.isArray( roles ) ? roles.join( ',' ) : roles;
		}

		return args;

	};

	/**
	 * Retrieve the API request path used to perform the async search
	 *
	 * A custom searchPath can be passed in as a component property.
	 *
	 * @since [version]
	 *
	 * @return {String} API request path.
	 */
	getSearchPath = () => this.props.searchPath || '/wp/v2/users';

	/**
	 * Format the label displayed in search results.
	 *
	 * @since [version]
	 *
	 * @param {Object} result A post response object returned by the search api.
	 * @return {String} Label displayed for the search result item.
	 */
	formatSearchResultLabel = ( result ) => sprintf( __( '%s (ID# %d)', 'lifterlms' ), result.name, result.id );

}
