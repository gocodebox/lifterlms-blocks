/**
 * Basic inspector control for doing async searches via the WP Rest API
 *
 * This component should not be used as is and instead should be exptended like "search-post" or "search-user"
 *
 * @since    1.0.0
 * @version  1.0.0
 */

import { debounce } from 'throttle-debounce'
import AsyncSelect from 'react-select/lib/Async';

import './editor.scss';

const {
	__,
	sprintf,
} = wp.i18n
const {
	Component,
	Fragment,
} = wp.element
const {
	BaseControl
} = wp.components

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
