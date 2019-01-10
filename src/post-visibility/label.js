/**
 * Displays a "label" for the post visibility.
 *
 * @since    1.3.0
 * @version  1.3.0
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
