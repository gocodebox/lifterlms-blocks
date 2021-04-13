import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export function saveField( props ) {
	const { attributes } = props;
	return attributes;
}

export function saveGroup( props ) {
	return <InnerBlocks.Content />;
}
