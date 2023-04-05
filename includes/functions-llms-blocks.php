<?php
/**
 * Serverside block compononent registration
 *
 * @package  LifterLMS_Blocks/Functions
 * @since    1.3.0
 * @version  [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * Determine if the Classic Editor is enabled for a given post.
 *
 * @since 1.3.0
 *
 * @param   mixed $post WP_Post or WP_Post ID.
 * @return  boolean
 */
function llms_blocks_is_classic_enabled_for_post( $post ) {

	$ret = false;

	if ( class_exists( 'Classic_Editor' ) ) {

		// Users can choose which editor.
		if ( 'allow' === get_option( 'classic-editor-allow-users', 'disallow' ) ) {

			// check the postmeta to determine which editor we're using.
			$post = get_post( $post );
			if ( $post ) {
				$ret = ( 'classic-editor' === get_post_meta( $post->ID, 'classic-editor-remember', true ) );
			}

			// Uses same editor for all posts.
		} else {

			$ret = ( 'classic' === get_option( 'classic-editor-replace', 'classic' ) );

		}
	}

	return apply_filters( 'llms_blocks_is_classic_enabled_for_post', $ret, $post );

}

/**
 * Determine if a post is migrated.
 *
 * @since 1.3.1
 * @since [version] Added condition for checking if the post is an auto-draft and the Classic Editor is not active when postmeta is not generated.
 *
 * @param   mixed $post WP_Post or WP_Post ID.
 * @return  boolean
 */
function llms_blocks_is_post_migrated( $post ) {

	$post_id = null;
	$ret     = false;

	$post = get_post( $post );
	if ( $post ) {

		$post_id = $post->ID;

		// Classic editor is being used for this post.
		if ( llms_blocks_is_classic_enabled_for_post( $post_id ) ) {
			$ret = false;
		} else {
			// Checking if the post is an auto-draft (new post without any postmeta) and the Classic Editor is not active.
			if ( ! wp_is_post_revision( $post_id ) && 'auto-draft' === get_post_status( $post_id ) && ! class_exists( 'Classic_Editor' ) ) {
				$ret = true;
			} else {
				$ret = llms_parse_bool( get_post_meta( $post_id, '_llms_blocks_migrated', true ) );
			}
		}
	}

	return apply_filters( 'llms_blocks_is_post_migrated', $ret, $post_id );

}
