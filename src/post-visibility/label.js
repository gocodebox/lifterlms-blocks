/**
 * Displays a "label" for the post visibility.
 *
 * @since    [version]
 * @version  [version]
 */

// WP Deps.
const {
	withSelect,
} = wp.data;

// Internal Deps.
import { visibilityOptions } from './options';

function PostVisibilityLabel( { visibility } ) {

	return visibilityOptions.find( ( { value } ) => {
		return value === visibility;
	} ).label;

}

export default withSelect( ( select ) => ( {

	visibility: select( 'core/editor' ).getEditedPostAttribute( 'visibility' ),

} ) )( PostVisibilityLabel );
