/**
 * Merge Code button on the "Format" toolbar.
 *
 * @see {@link https://developer.wordpress.org/block-editor/tutorials/format-api/}
 *
 * @since 1.6.0
 * @version [version]
 */

// Local deps.
import { default as Edit } from './edit';

// WP deps.
import { __ } from '@wordpress/i18n';
import { registerFormatType } from '@wordpress/rich-text';

registerFormatType(
	'llms/userInfoShortcodes',
	{
		title: __( 'LifterLMS User Information Shortcodes', 'lifterlms' ),
		tagName: 'span',
		className: 'llms-user-sc-wrap',
		edit: Edit
	}
);
