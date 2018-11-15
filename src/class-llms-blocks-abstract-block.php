<?php
/**
 * Common block registration methods.
 *
 * @package  LifterLMS_Blocks/Abstracts
 * @since    [version]
 * @version  [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * Abstract Block class.
 */
abstract class LLMS_Blocks_Abstract_Block {

	/**
	 * Block vendor ID.
	 *
	 * @var string
	 */
	protected $vendor = 'llms';

	/**
	 * Block ID.
	 *
	 * @var string
	 */
	protected $id = '';

	/**
	 * Is block dynamic (rendered in PHP).
	 *
	 * @var bool
	 */
	protected $is_dynamic = false;

	/**
	 * Constructor.
	 *
	 * @since    [version]
	 * @version  [version]
	 */
	public function __construct() {

		if ( $this->is_dynamic ) {

			register_block_type(
				$this->get_block_id(),
				array(
					'render_callback' => array( $this, 'render_callback' ),
				)
			);

		}

		$this->register_meta();

	}

	/**
	 * Add hooks stub.
	 * Extending classes can use this class to add hooks attached to the render function action.
	 *
	 * @param   array  $attributes Optional. Block attributes. Default empty array.
	 * @param   string $content    Optional. Block content. Default empty string.
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function add_hooks( $attributes = array(), $content = '' ) {}

	/**
	 * Retrieve the ID/Name of the block.
	 *
	 * @return  string
	 * @since   [version]
	 * @version [version]
	 */
	public function get_block_id() {
		return sprintf( '%1$s/%2$s', $this->vendor, $this->id );
	}

	/**
	 * Removed hooks stub.
	 * Extending classes can use this class to remove hooks attached to the render function action.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function remove_hooks() {}

	/**
	 * Renders the block type output for given attributes.
	 *
	 * @param   array  $attributes Optional. Block attributes. Default empty array.
	 * @param   string $content    Optional. Block content. Default empty string.
	 * @return  string
	 * @since   [version]
	 * @version [version]
	 */
	public function render_callback( $attributes = array(), $content = '' ) {

		$this->add_hooks( $attributes, $content );

		ob_start();
		// EG: add_action( 'llms_name-block_render', 'my_func', 10, 1 ).
		do_action( sprintf( '%1$s_block_render', $this->get_block_id() ), $attributes, $content );
		$ret = ob_get_clean();

		$this->remove_hooks();

		return $ret;
	}

	/**
	 * Register meta attributes stub.
	 *
	 * Called after registering the block type.
	 *
	 * @return  void
	 * @since   [version]
	 * @version [version]
	 */
	public function register_meta() {}

}
