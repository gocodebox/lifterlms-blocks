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
import AsyncSelect from 'react-select/lib/Async';

// Internal Deps.
import './editor.scss';

// WP Deps.
const
	{
		__,
		sprintf,
	} = wp.i18n,
	{
		Component,
		Fragment,
	} = wp.element,
	{
		BaseControl
	} = wp.components;

/**
 * Async Search Component
 *
 * @since 1.0.0
 * @since 1.6.0 Added isDisabled property.
 */
export default class Search extends Component {

	getSearchUrl = ( search, per_page ) => (
		wp.url.addQueryArgs( '/wp/v2/', {
			per_page: 20,
			search: encodeURI( search ),
		} )
	)

	formatSearchResults = ( results ) => (
		results.map( result => ( {
			label: result.id,
			value: result.id,
		} ) )
	)

	onSearch = debounce( 300, ( search, callback ) => {

		wp.apiFetch( { path: this.getSearchUrl( search, 20 ) } )
			.then( results => {
				callback( this.formatSearchResults( results ) )
			} );

	} )

	render() {

		const {
			label,
			isMulti,
			isDisabled,
			onChange,
			placeholder,
			postTypes,
			selected,
		} = this.props

		return (
			<Fragment>

				<BaseControl
					label={ label }
				>
					<AsyncSelect
						className="llms-search"
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
			</Fragment>
		)

	}

}
