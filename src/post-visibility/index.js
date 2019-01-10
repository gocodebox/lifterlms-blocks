/**
 * Post Visibility settings for courses & memberships
 *
 * @since    [version]
 * @version  [version]
 */

// WP Deps.
const { registerPlugin } = wp.plugins;

// Internal Deps.
import { default as PostVisibility } from './component';

registerPlugin(
	'llms-post-visibility', {
		render: PostVisibility,
	}
);
