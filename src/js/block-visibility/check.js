/**
 * Determine if a block should have visibility settings added to it.
 *
 * @since 1.6.0
 * @since 1.7.1 Add filter, `llms_block_supports_visibility` to allow modification of the return of the check.
 * @since 1.8.0 Add a "blacklist" of blocks that don't support visibility.
 *
 * @param {Object} settings Block settings object.
 * @param {string} name Block name, eg "core/paragraph".
 * @return {boolean}
 */
export default function supportsVisibility( settings, name ) {
	// WP Deps.
	const { applyFilters } = wp.hooks;

	let ret = true;

	// Don't add to Dynamic Blocks.
	if ( -1 !== window.llms.dynamic_blocks.indexOf( name ) ) {
		ret = false;

		// Don't add to blocks that explicitly don't support llms_visibility.
	} else if (
		settings.supports &&
		false === settings.supports.llms_visibility
	) {
		ret = false;

		// Exclude blocks identified by our blacklist.
	} else if ( getBlacklist().includes( name ) ) {
		ret = false;
	}

	return applyFilters(
		'llms_block_supports_visibility',
		ret,
		settings,
		name
	);
}

/**
 * Returns a list of blocks that we've decided should not support block visibility
 *
 * @since 1.8.0
 *
 * @return {Array} List of block names.
 */
const getBlacklist = () => {
	return [
		/**
		 * Otherwise known as the "Classic" block.
		 *
		 * @link https://github.com/gocodebox/lifterlms-blocks/issues/41
		 */
		'core/freeform',
	];
};
