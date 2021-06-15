// WP Deps.
import { select } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

/**
 * Determine if the post content is completely empty
 *
 * @since [version]
 *
 * @return {boolean} [description]
 */
export default function () {
	const { getEditedPostContent } = select( editorStore ),
		content = getEditedPostContent();
	return ! content || ! content.includes( '<!-- wp:' );
}
