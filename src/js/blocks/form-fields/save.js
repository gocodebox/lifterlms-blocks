/**
 * Block save functions
 *
 * @since [version]
 */

// WP deps.
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Save function for a standard field
 *
 * @since [version]
 *
 * @param {Object} props Block properties.
 * @return {Object} Block attributes object.
 */
export function SaveField( props ) {
	const { attributes } = props;
	return attributes;
}

/**
 * Save function for a standard field
 *
 * @since [version]
 *
 * @return {InnerBlocks.Content} Inner blocks.
 */
export function SaveGroup() {
	return <InnerBlocks.Content />;
}
