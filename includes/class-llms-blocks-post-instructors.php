<?php
/**
 * Handle course & membership instructors data.
 *
 * @package  LifterLMS_Blocks/Classes
 * @since    [version]
 * @version  [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handle course & membership instructors data.
 */
class LLMS_Blocks_Post_Instructors {

	/**
	 * Constructor.
	 *
	 * @since    [version]
	 * @version  [version]
	 */
	public function __construct() {

		add_action( 'init', array( $this, 'register_meta' ) );
		// add_action( 'save_post_course', array( $this, 'ensure_post_author' ), 25, 2 );
		// add_action( 'save_post_llms_membership', array( $this, 'ensure_post_author' ), 25, 2 );
	}

	/**
	 * Meta field update authorization callback.
	 *
	 * @param   bool   $allowed   Is the update allowed.
	 * @param   string $meta_key  Meta keyname.
	 * @param   int    $object_id WP Object ID (post,comment,etc)...
	 * @param   int    $user_id   WP User ID
	 * @param   [type] $cap       [description]
	 * @param   [type] $caps      [description]
	 * @return  [type]
	 * @since   [version]
	 * @version [version]
	 */
	public function authorize_callback( $allowed, $meta_key, $object_id, $user_id, $cap, $caps ) {
		return user_can( $user_id, 'edit_post', $object_id );
	}

	// public function ensure_post_author( $post_id, $post ) {
	// if ( ! $post->post_author ) {
	// remove_action( 'save_post_' . $post->post_type, array( $this, 'ensure_post_author' ) );
	// $obj = llms_get_post( $post );
	// if ( $post ) {
	// $instructors = $obj->instructors()->get_instructors( false );
	// $obj->set( 'author', $instructors[0]['id'] );
	// }
	// add_action( 'save_post_' . $post->post_type, array( $this, 'ensure_post_author' ) );
	// }
	// }

	/**
	 * Retrieve instructor information for a give object.
	 *
	 * @param   array           $obj  Assoc. array of WP_Post data.
	 * @param   WP_REST_Request $request   Full details about the request.
	 * @return  WP_Error|object Object containing the meta values by name, otherwise WP_Error object.
	 * @since   [version]
	 * @version [version]
	 */
	public function get_callback( $obj, $request ) {

		$ret = array();

		$obj = llms_get_post( $obj['id'] );
		if ( $obj ) {
			$ret = $obj->instructors()->get_instructors( false );
			foreach ( $ret as &$instructor ) {
				$name    = '';
				$student = llms_get_student( $instructor['id'] );
				if ( $student ) {
					$name = $student->get_name();
				}
				$instructor['name'] = $name;
			}
		}
		return $ret;

	}

	/**
	 * Update instructor information for a given object.
	 *
	 * @param   string  $value  Instructor data to add to the object (JSON).
	 * @param   WP_Post $object WP_Post object.
	 * @param   string  $key    name of the field.
	 * @return  null|WP_Error
	 * @since   [version]
	 * @version [version]
	 */
	public function update_callback( $value, $object, $key ) {

		if ( ! current_user_can( 'edit_post', $object->ID ) ) {
			return new WP_Error(
				'rest_cannot_update',
				__( 'Sorry, you are not allowed to edit the object instructors.', 'lifterlms' ),
				array(
					'key'    => $name,
					'status' => rest_authorization_required_code(),
				)
			);
		}

		$obj = llms_get_post( $object );
		if ( $obj ) {
			$obj->instructors()->set_instructors( $value );
		}

		return null;
	}


	public function register_meta() {

		foreach ( array( 'course', 'llms_membership' ) as $post_type ) {

			register_rest_field(
				$post_type,
				'instructors',
				array(
					'get_callback'    => array( $this, 'get_callback' ),
					'update_callback' => array( $this, 'update_callback' ),
					'schema'          => array(
						'description' => __( 'Instructor fields.' ),
						'type'        => 'object',
						'context'     => array( 'view', 'edit' ),
						'properties'  => array(),
						'arg_options' => array(
							'sanitize_callback' => null,
							'validate_callback' => null,
						),
					),
				)
			);

			// register_meta( 'post', '_llms_instructors', array(
			// 'type' => 'string',
			// 'object_subtype' => 'course',
			// 'single' => true,
			// 'show_in_rest' => array(
			// 'prepare_callback' => array( $this, 'prepare_value' ),
			// ),
			// 'auth_callback' => array( $this, 'authorize_callback' ),
			// 'sanitize_callback' => array( $this, 'sanitize_callback' ),
			// ) );
		}

	}

	public function sanitize_callback( $meta_value, $meta_key ) {

		if ( is_string( $meta_value ) ) {

			$meta_value = json_decode( $meta_value, true );
			$defaults   = llms_get_instructors_defaults();

			foreach ( $meta_value as &$instructor ) {

				$instructor = wp_parse_args( $instructor, $defaults );

				// remove all non approved keys
				foreach ( array_keys( $instructor ) as $key ) {

					if ( ! in_array( $key, array_keys( $defaults ) ) ) {
						unset( $instructor[ $key ] );
					}
				}
			}
		}

		return $meta_value;
	}

}

return new LLMS_Blocks_Post_Instructors();
