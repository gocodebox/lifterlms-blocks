/**
 * A jest snapshot matcher used to match against a WP_Block object
 *
 * This matcher ensures that innerBlocks (which may vary) and the clientId
 * don't affect snapshots of the block object.
 *
 * @since 2.0.0
 *
 * @type {Object}
 */
export default {
	clientId: expect.any( String ),
	innerBlocks: expect.anything(), // You'd think that `expect.any( Array )` would work but doesn't.
};
