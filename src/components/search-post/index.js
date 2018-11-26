/**
 * Inspector Control to search the WP database for posts
 *
 * @since    [version]
 * @version  [version]
 */

import Search from '../search'

export default class SearchPost extends Search {

	getSearchUrl = ( search, per_page ) => (
		wp.url.addQueryArgs( '/wp/v2/' + this.props.postType, {
			per_page: 20,
			search: encodeURI( search ),
		} )
	)

	formatSearchResults = ( posts ) => (
		posts.map( post => ( {
			label: sprintf( '%s (ID# %d)', post.title.rendered, post.id ),
			value: post.id,
			id: post.id,
			type: post.type,
		} ) )
	)

}
