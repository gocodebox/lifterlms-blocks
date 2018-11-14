/**
 * Inspector Control to search the WP database for posts
 *
 * @since    [version]
 * @version  [version]
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

export default class SearchPost extends Component {

	onSearch = debounce( 300, ( search, callback ) => {

		const url =  wp.url.addQueryArgs( '/wp/v2/' + this.props.postType, {
			per_page: 20,
			search: encodeURI( search ),
		} )

		wp.apiFetch( { path: url } )
			.then( posts => {
				callback( posts.map( post => ( {
					label: sprintf( '%s (ID# %d)', post.title.rendered, post.id ),
					value: post.id,
					id: post.id,
					type: post.type,
				} ) ) )
			} );

	} )

	render() {

		const {
			label,
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
						className="llms-search-post"
						isMulti
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
