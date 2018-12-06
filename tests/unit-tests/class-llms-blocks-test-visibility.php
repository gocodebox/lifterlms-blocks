<?php
/**
 * Test LLMS_Blocks_Visibility class & methods.
 * @since   1.0.0
 * @version 1.0.0
 */
class LLMS_Blocks_Test_Visibility extends LLMS_Blocks_Unit_Test_Case {

	/**
	 * Custom assertion for this test case
	 *
	 * @param   string    $expected    Expected content.
	 * @param   string    $raw_content Raw content to check against, will be run through `the_content` filter.
	 * @return  void
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	private function assertPostContentEquals( $expected, $raw_content ) {

		$this->assertEquals( $this->clean_content( $expected ), $this->clean_content( apply_filters( 'the_content', $raw_content ) ) );

	}

	/**
	 * Normalize content, used by assertPostContentEquals to strip spaces and newlines resulting from hidden content gaps.
	 * @param   string    $content text/html content
	 * @return  string
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	private function clean_content( $content ) {

		return trim( preg_replace( '/<!--(.|\s)*?-->/', '', $content ) );

	}

	/**
	 * Creates a new post with a paragaph block configured with the desired visibility settings.
	 *
	 * @param   array     $block_settings Desired block settings attributes.
	 * @param   string    $post_type      Post type of the created post.
	 * @return  WP_Post
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	private function create_post( $block_settings = array(), $post_type = 'post' ) {

		$block_settings = json_encode( $block_settings );
		ob_start();
		?>
		<!-- wp:paragraph <?php echo $block_settings; ?> -->
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
		<!-- /wp:paragraph -->
		<?php
		$content = ob_get_clean();

		global $post;
		$post = $this->factory->post->create_and_get( array(
			'post_content' => $content,
			'post_type' => $post_type,
		) );

		return $post;

	}

	/**
	 * Encode and stringify posts array used in block settings.
	 *
	 * @param   array    $array array of post data as returned by `get_posts_array()`.
	 * @return  string
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	private function encode_posts_array( $array ) {
		return str_replace( '"', '\u0022', json_encode( $array ) );
	}

	/**
	 * Create a number of posts and return an array of data to be used in block settings.
	 *
	 * @param   int       $count number of posts to create.
	 * @param   string    $type  post type.
	 * @return  array
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	private function get_posts_array( $count = 1, $type = 'course' ) {

		$posts = array();
		$i = 1;
		while ( $i <= $count ) {

			$post = $this->factory->post->create_and_get( array(
				'post_type' => $type,
			) );

			$posts[] = array(
				'id' => $post->ID,
				'type' => $post->post_type,
				'value' => $post->ID,
				'label' => sprintf( '%1$s (ID# %2$d)', $post->post_title, $post->ID ),
			);

			$i++;

		}

		return $posts;

	}

	/**
	 * Test that blocks which have been run through `the_content` filter are displayed/hidden based on block visibility settings.
	 *
	 * @return  void
	 * @since   1.0.0
	 * @version 1.0.0
	 */
	public function test_visibility() {

		global $current_user;

		// Get a student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Default Settings: show to everyone.
		 */
		$post = $this->create_post();

		// Logged out.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );

		foreach ( array( 'course', 'llms_membership' ) as $post_type ) {

			/**
			 * Enrollment in current course/membership.
			 */
			$post = $this->create_post( array(
				'llms_visibility' => 'enrolled',
				'llms_visibility_in' => 'this'
			), $post_type );

			// Logged out.
			$this->assertPostContentEquals( '', $post->post_content );
			// Logged in.
			wp_set_current_user( $student_id );
			// Not enrolled.
			$this->assertPostContentEquals( '', $post->post_content );
			// Enrolled.
			llms_enroll_student( $student_id, $post->ID );
			$this->assertPostContentEquals( $post->post_content, $post->post_content );

			// Log out & start over.
			wp_set_current_user( null );


			/**
			 * Enrollment in multiple courses/memberships (all).
			 */
			$list = $this->get_posts_array( 2, $post_type );
			$post = $this->create_post( array(
				'llms_visibility' => 'enrolled',
				'llms_visibility_in' => 'list_all',
				'llms_visibility_posts' => $this->encode_posts_array( $list ),
			), $post_type );

			// Logged Out.
			$this->assertPostContentEquals( '', $post->post_content );
			// Logged in.
			wp_set_current_user( $student_id );
			// Not enrolled.
			$this->assertPostContentEquals( '', $post->post_content );
			// Enrolled in 1 of 2.
			llms_enroll_student( $student_id, $list[0]['id'] );
			$this->assertPostContentEquals( '', $post->post_content );
			// Enrolled in both.
			llms_enroll_student( $student_id, $list[1]['id'] );
			$this->assertPostContentEquals( $post->post_content, $post->post_content );

			// Log out & start over.
			wp_set_current_user( null );


			/**
			 * Enrollment in multiple courses/memberships (any).
			 */
			$list = $this->get_posts_array( 2, $post_type );
			$post = $this->create_post( array(
				'llms_visibility' => 'enrolled',
				'llms_visibility_in' => 'list_any',
				'llms_visibility_posts' => $this->encode_posts_array( $list ),
			), $post_type );

			// Logged Out.
			$this->assertPostContentEquals( '', $post->post_content );
			// Logged in.
			wp_set_current_user( $student_id );
			// Not enrolled.
			$this->assertPostContentEquals( '', $post->post_content );
			// Enrolled in 1 of 2.
			llms_enroll_student( $student_id, $list[1]['id'] );
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Enrolled in both.
			llms_enroll_student( $student_id, $list[0]['id'] );
			$this->assertPostContentEquals( $post->post_content, $post->post_content );

			// Log out & start over.
			wp_set_current_user( null );


			/**
			 * Not enrolled in current course/membership.
			 */
			$post = $this->create_post( array(
				'llms_visibility' => 'not_enrolled',
				'llms_visibility_in' => 'this'
			), $post_type );

			// Logged out.
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Logged in.
			wp_set_current_user( $student_id );
			// Not enrolled.
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Enrolled.
			llms_enroll_student( $student_id, $post->ID );
			$this->assertPostContentEquals( '', $post->post_content );

			// Log out & start over.
			wp_set_current_user( null );


			/**
			 * Not enrolled in multiple courses/memberships (all).
			 */
			$list = $this->get_posts_array( 2, $post_type );
			$post = $this->create_post( array(
				'llms_visibility' => 'not_enrolled',
				'llms_visibility_in' => 'list_all',
				'llms_visibility_posts' => $this->encode_posts_array( $list ),
			), $post_type );

			// Logged Out.
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Logged in.
			wp_set_current_user( $student_id );
			// Not enrolled.
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Enrolled in 1 of 2.
			llms_enroll_student( $student_id, $list[0]['id'] );
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Enrolled in both.
			llms_enroll_student( $student_id, $list[1]['id'] );
			$this->assertPostContentEquals( '', $post->post_content );

			// Log out & start over.
			wp_set_current_user( null );


			/**
			 * Not enrolled in multiple courses/memberships (any).
			 */
			$list = $this->get_posts_array( 2, $post_type );
			$post = $this->create_post( array(
				'llms_visibility' => 'not_enrolled',
				'llms_visibility_in' => 'list_any',
				'llms_visibility_posts' => $this->encode_posts_array( $list ),
			), $post_type );

			// Logged Out.
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Logged in.
			wp_set_current_user( $student_id );
			// Not enrolled.
			$this->assertPostContentEquals( $post->post_content, $post->post_content );
			// Enrolled in 1 of 2.
			llms_enroll_student( $student_id, $list[1]['id'] );
			$this->assertPostContentEquals( '', $post->post_content );
			// Enrolled in both.
			llms_enroll_student( $student_id, $list[0]['id'] );
			$this->assertPostContentEquals( '', $post->post_content );

			// Log out & start over.
			wp_set_current_user( null );

		}


		/**
		 * Enrollment in multiple courses & memberships, mixed (all).
		 */
		$list = array_merge( $this->get_posts_array( 1, 'course' ), $this->get_posts_array( 1, 'llms_membership' ) );
		$post = $this->create_post( array(
			'llms_visibility' => 'enrolled',
			'llms_visibility_in' => 'list_all',
			'llms_visibility_posts' => $this->encode_posts_array( $list ),
		) );

		// Logged Out.
		$this->assertPostContentEquals( '', $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in 1 of 2.
		llms_enroll_student( $student_id, $list[0]['id'] );
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in both.
		llms_enroll_student( $student_id, $list[1]['id'] );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		/**
		 * Enrollment in multiple courses & memberships, mixed (any).
		 */
		$list = array_merge( $this->get_posts_array( 1, 'course' ), $this->get_posts_array( 1, 'llms_membership' ) );
		$post = $this->create_post( array(
			'llms_visibility' => 'enrolled',
			'llms_visibility_in' => 'list_any',
			'llms_visibility_posts' => $this->encode_posts_array( $list ),
		) );

		// Logged Out.
		$this->assertPostContentEquals( '', $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in 1 of 2.
		llms_enroll_student( $student_id, $list[1]['id'] );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in both.
		llms_enroll_student( $student_id, $list[0]['id'] );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		// Get a new student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Enrollment in anything.
		 */
		$post = $this->create_post( array(
			'llms_visibility' => 'enrolled',
			'llms_visibility_in' => 'any',
		) );
		$membership_id = $this->factory->post->create( array( 'post_type' => 'llms_membership' ) );
		$course_id = $this->factory->post->create( array( 'post_type' => 'course' ) );

		// Logged Out.
		$this->assertPostContentEquals( '', $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in a membership.
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		llms_unenroll_student( $student_id, $membership_id );
		// Enrolled in a course.
		llms_enroll_student( $student_id, $course_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in course & membership.
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		// Get a new student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Enrollment in any course.
		 */
		$post = $this->create_post( array(
			'llms_visibility' => 'enrolled',
			'llms_visibility_in' => 'any_course',
		) );

		// Logged Out.
		$this->assertPostContentEquals( '', $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in a membership (doesn't grant access).
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( '', $post->post_content );
		llms_unenroll_student( $student_id, $membership_id );
		// Enrolled in a course.
		llms_enroll_student( $student_id, $course_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in course & membership.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		// Get a new student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Enrollment in any membership.
		 */
		$post = $this->create_post( array(
			'llms_visibility' => 'enrolled',
			'llms_visibility_in' => 'any_membership',
		) );

		// Logged Out.
		$this->assertPostContentEquals( '', $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in a course (doesn't grant access).
		llms_enroll_student( $student_id, $course_id );
		$this->assertPostContentEquals( '', $post->post_content );
		llms_unenroll_student( $student_id, $course_id );
		// Enrolled in a membership.
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		llms_enroll_student( $student_id, $course_id );
		// Enrolled in course & membership.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		/**
		 * Not enrolled in multiple courses & memberships, mixed (all).
		 */
		$list = array_merge( $this->get_posts_array( 1, 'course' ), $this->get_posts_array( 1, 'llms_membership' ) );
		$post = $this->create_post( array(
			'llms_visibility' => 'not_enrolled',
			'llms_visibility_in' => 'list_all',
			'llms_visibility_posts' => $this->encode_posts_array( $list ),
		) );

		// Logged Out.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in 1 of 2.
		llms_enroll_student( $student_id, $list[0]['id'] );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in both.
		llms_enroll_student( $student_id, $list[1]['id'] );
		$this->assertPostContentEquals( '', $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		/**
		 * Not enrolled in multiple courses & memberships, mixed (any).
		 */
		$list = array_merge( $this->get_posts_array( 1, 'course' ), $this->get_posts_array( 1, 'llms_membership' ) );
		$post = $this->create_post( array(
			'llms_visibility' => 'not_enrolled',
			'llms_visibility_in' => 'list_any',
			'llms_visibility_posts' => $this->encode_posts_array( $list ),
		) );

		// Logged Out.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in 1 of 2.
		llms_enroll_student( $student_id, $list[1]['id'] );
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in both.
		llms_enroll_student( $student_id, $list[0]['id'] );
		$this->assertPostContentEquals( '', $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		// Get a new student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Not enrolled in anything.
		 */
		$post = $this->create_post( array(
			'llms_visibility' => 'not_enrolled',
			'llms_visibility_in' => 'any',
		) );
		$membership_id = $this->factory->post->create( array( 'post_type' => 'llms_membership' ) );
		$course_id = $this->factory->post->create( array( 'post_type' => 'course' ) );

		// Logged Out.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in a membership.
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( '', $post->post_content );
		llms_unenroll_student( $student_id, $membership_id );
		// Enrolled in a course.
		llms_enroll_student( $student_id, $course_id );
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in course & membership.
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( '', $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		// Get a new student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Not enrolled in any course.
		 */
		$post = $this->create_post( array(
			'llms_visibility' => 'not_enrolled',
			'llms_visibility_in' => 'any_course',
		) );

		// Logged Out.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in a membership (doesn't grant access).
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		llms_unenroll_student( $student_id, $membership_id );
		// Enrolled in a course.
		llms_enroll_student( $student_id, $course_id );
		$this->assertPostContentEquals( '', $post->post_content );
		// Enrolled in course & membership.
		$this->assertPostContentEquals( '', $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );


		// Get a new student account to test against.
		$student_id = $this->factory->student->create();

		/**
		 * Not enrolled in any membership.
		 */
		$post = $this->create_post( array(
			'llms_visibility' => 'not_enrolled',
			'llms_visibility_in' => 'any_membership',
		) );

		// Logged Out.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Logged in.
		wp_set_current_user( $student_id );
		// Not enrolled.
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		// Enrolled in a course (doesn't grant access).
		llms_enroll_student( $student_id, $course_id );
		$this->assertPostContentEquals( $post->post_content, $post->post_content );
		llms_unenroll_student( $student_id, $course_id );
		// Enrolled in a membership.
		llms_enroll_student( $student_id, $membership_id );
		$this->assertPostContentEquals( '', $post->post_content );
		llms_enroll_student( $student_id, $course_id );
		// Enrolled in course & membership.
		$this->assertPostContentEquals( '', $post->post_content );

		// Log out & start over.
		wp_set_current_user( null );

	}

}
