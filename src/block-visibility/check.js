/**
 * Determine if a block should have visibility settings added to it.
 *
 * @since 1.6.0
 *
 * @param {Object} settings Block settings object.
 * @param {String} name Block name, eg "core/paragraph".
 * @return {Boolean}
 */
export default function supportsVisibility( settings, name ) {

	// Don't add to Dynamic Blocks.
	if ( -1 !== window.llms.dynamic_blocks.indexOf( name ) ) {
		return false;

	// Don't add to blocks that explicitly don't support llms_visibility.
	} else if ( settings.supports && false === settings.supports.llms_visibility ) {
		return false;
	}

	return true;

}
