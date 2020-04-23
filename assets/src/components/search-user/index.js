/**
 * Inspector Control to search the WP database for posts
 *
 * @since    1.0.0
 * @version  1.0.0
 */

import Search from '../search'

export default class SearchUser extends Search {

	getSearchUrl = ( search, per_page ) => {

		let args = {
			per_page: 20,
			search: encodeURI( search ),
		}

		const { roles } = this.props;

		if ( roles ) {
			args.roles = Array.isArray( roles ) ? roles.join( ',' ) : roles
		}

		return wp.url.addQueryArgs( '/wp/v2/users', args )

	}

	formatSearchResults = ( users ) => (
		users.map( user => ( {
			label: sprintf( '%s (ID# %d)', user.name, user.id ),
			value: user.id,
			id: user.id,
			_user: user,
		} ) )
	)

}
