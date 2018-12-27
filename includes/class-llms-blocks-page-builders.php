<?php
/**
 * Adds support for page builder plugins..
 *
 * @package  LifterLMS_Blocks/Classes
 * @since    [version]
 * @version  [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * LLMS_Blocks_Page_Builders class..
 */
class LLMS_Blocks_Page_Builders {

	/**
	 * Constructor.
	 *
	 * @since    [version]
	 * @version  [version]
	 */
	public static function init() {

		add_action( 'init', array( __CLASS__, 'add_filters' ) );

	}

	/**
	 * Add filters to support various page builder plugins.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public static function add_filters() {

		if ( defined( 'FL_BUILDER_VERSION' ) ) {
			add_filter( 'llms_blocks_is_post_migrated', array( __CLASS__, 'check_for_beaver' ), 15, 2 );
		} elseif ( defined( 'ELEMENTOR_VERSION' ) ) {
			add_filter( 'llms_blocks_is_post_migrated', array( __CLASS__, 'check_for_elementor' ), 15, 2 );
		} elseif ( defined( 'ET_BUILDER_VERSION' ) ) {
			add_filter( 'llms_blocks_is_post_migrated', array( __CLASS__, 'check_for_divi' ), 15, 2 );
		}

	}

	/**
	 * Add support for Beaver Builder.
	 * If the builder is enabled for the post LifterLMS should treat the post as not migrated (actions are not removed).
	 *
	 * @param   bool $val default value of the migration status.
	 * @param   int  $post_id WP_Post ID.
	 * @return  bool
	 * @since   [version]
	 * @version [version]
	 */
	public static function check_for_beaver( $val, $post_id ) {

		// If Beaver Builder is enabled for the post, don't remove actions.
		if ( FLBuilderModel::is_builder_enabled( $post_id ) ) {
			$val = false;
		}

		return $val;

	}

	/**
	 * Add support for Beaver Builder.
	 * If the builder is enabled for the post LifterLMS should treat the post as not migrated (actions are not removed).
	 *
	 * @param   bool $val default value of the migration status.
	 * @param   int  $post_id WP_Post ID.
	 * @return  bool
	 * @since   [version]
	 * @version [version]
	 */
	public static function check_for_elementor( $val, $post_id ) {

		// If Divi builder is enabled for the post, don't remove actions.
		if ( 'builder' === get_post_meta( $post_id, '_elementor_edit_mode', true ) ) {
			$val = false;
		}

		return $val;

	}

	/**
	 * Add support for Divi (ET) Builder.
	 * If the builder is enabled for the post LifterLMS should treat the post as not migrated (actions are not removed).
	 *
	 * @param   bool $val default value of the migration status.
	 * @param   int  $post_id WP_Post ID.
	 * @return  bool
	 * @since   [version]
	 * @version [version]
	 */
	public static function check_for_divi( $val, $post_id ) {

		// If Divi builder is enabled for the post, don't remove actions.
		if ( 'on' === get_post_meta( $post_id, '_et_pb_use_builder', true ) ) {
			$val = false;
		}

		return $val;

	}

}

return LLMS_Blocks_Page_Builders::init();
