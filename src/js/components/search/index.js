/**
 * Basic inspector control for doing async searches via the WP Rest API
 *
 * This component should not be used as is and instead should be exptended like "search-post" or "search-user"
 *
 * @since 1.0.0
 * @version 1.6.0
 */

// External Deps.
import { debounce } from 'throttle-debounce'
import Select from 'react-select/async';

// WP deps.
import {
	__,
	sprintf,
} from '@wordpress/i18n';
import {
	Component,
	Fragment,
} from '@wordpress/element';

import { BaseControl } from '@wordpress/components';

// Internal Deps.
import './editor.scss';

/**
 * Base async Search Component
 *
 * @since 1.0.0
 * @since 1.6.0 Added isDisabled property.
 */
export default class Search extends Component {

	/**
	 * Holds a reference to the base Select component.
	 *
	 * @type {Object}
	 */
	selectRef = null;

	/**
	 * Retrieve the default classname for the main Select element
	 *
	 * @since [version]
	 *
	 * @return {String} Class name to be used.
	 */
	getDefaultClassName = () => 'llms-search';

	/**
	 * Generates an object of arguments appended to the search URL.
	 *
	 * Merges the searchArgs property with default arguments and the search string.
	 *
	 * @since [version]
	 *
	 * @param {String} search Search string, this will be included in the arguments as the `search` property.
	 * @return {String} Full API request string.
	 */
	getSearchArgs( search ) {
		return Object.assign(
			{
				per_page: 20,
				search: encodeURI( search ),
			},
			this.props.searchArgs
		);
	}

	/**
	 * Retrieve the API request path used to perform the async search
	 *
	 * The searchPath should be passed in as a component property or child classes should
	 * override this method to implement their own searchPath logic.
	 *
	 * @since [version]
	 *
	 * @return {String} API request path.
	 */
	getSearchPath = () => this.props.searchPath;

	/**
	 * Retrieve the API request path used to perform the async search
	 *
	 * The searchPath should be passed in as a component property or child classes should
	 * override this method to implement their own searchPath logic.
	 *
	 * @since [version]
	 *
	 * @return {String} API request path.
	 */
	getSearchUrl = search => wp.url.addQueryArgs( this.getSearchPath(), this.getSearchArgs( search ) );

	/**
	 * Generate the label used for an individual search result item.
	 *
	 * This method is intended to be overridden by extending classes.
	 *
	 * @since [version]
	 *
	 * @param {Object} result API response object from the search API.
	 * @return {String} Formatted search result label.
	 */
	formatSearchResultLabel = ( result ) => result.id;

	/**
	 * Generate the value used for an individual search result item.
	 *
	 * Uses the object's `id` by default and can be overridden by extending components
	 * to change this default behavior
	 *
	 * @since [version]
	 *
	 * @param {Object} result API response object from the search API.
	 * @return {Number} Search result value.
	 */
	formatSearchResultValue = ( result ) => result.id;

	/**
	 * Formats the search API response array to include the required `label` and `value` properties.
	 *
	 * @since 1.0.0
	 * @since [version] Updated to use helper methods for generating the label and value props.
	 *
	 * @param {Object[]} results Array of api response objects.
	 * @return {Object[]} Array of api response objects with the required `label` and `value` props added to each item.
	 */
	formatSearchResults( results ) {
		return results.map( result => ( {
			...result,
			label: this.formatSearchResultLabel( result ),
			value: this.formatSearchResultValue( result ),
		} ) );
	};

	/**
	 * Perform the search.
	 *
	 * @since 1.0.0
	 *
	 * @return {Promise} API response promise.
	 */
	onSearch = debounce( 300, ( search, callback ) => {

		wp.apiFetch( { path: this.getSearchUrl( search ) } )
			.then( results => {
				callback( this.formatSearchResults( results ) )
			} );

	} );

	/**
	 * Render the component
	 *
	 * @since 1.0.0
	 *
	 * @return {Fragment}
	 */
	render() {

		const {
			className,
			classNamePrefix,
			label,
			isMulti,
			isDisabled,
			onChange,
			placeholder,
			selected,
		} = this.props

		return (
			<BaseControl label={ label }>
				<Select
					ref={ ref => this.selectRef = ref }
					className={ className || this.getDefaultClassName() }
					classNamePrefix="llms-search"
					isMulti={ isMulti }
					isDisabled={ isDisabled }
					value={ selected }
					defaultOptions={ selected }
					placeholder={ placeholder }
					loadOptions={ this.onSearch }
					onChange={ onChange }
					styles={ {
						control: ( control ) => ( {
							...control,
							borderColor: '#8d96a0',
							'&:hover': {
								...control[ '&:hover' ],
								borderColor: '#8d96a0',
							},
						} ),
					} }
					theme={ theme => ( {
						...theme,
						colors: {
							...theme.colors,
							primary: '#008dbe',
							primary25: '#ccf2ff',
							primary50: '#b3ecff',
							primary75: '#4dd2ff',
						},
						spacing: {
							...theme.spacing,
							baseUnit: 2,
							controlHeight: 28,
							menuGutter: 4,
						}
					} ) }
				/>
			</BaseControl>
		)

	}

}
