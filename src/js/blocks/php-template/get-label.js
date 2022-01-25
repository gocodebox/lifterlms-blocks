import { __ } from '@wordpress/i18n';

export default function( template ) {

	const labels = {
		'archive-course':             __( 'Course Catalog', 'lifterlms' ),
		'archive-llms_membership':    __( 'Membership Catalog', 'lifterlms' ),
		'single-certificate':         __( 'Single Certificate', 'lifterlms' ),
		'single-no-access':           __( 'Single Requiring Membership', 'lifterlms' ),
		'taxonomy-course_cat':        __( 'Taxonomy Course Category', 'lifterlms' ),
		'taxonomy-course_difficulty': __( 'Taxonomy Course Difficulty', 'lifterlms' ),
		'taxonomy-course_tag':        __( 'Taxonomy Course Tag', 'lifterlms' ),
		'taxonomy-course_track':      __( 'Taxonomy Course Track', 'lifterlms' ),
		'taxonomy-memberhsip_cat':    __( 'Taxonomy Membership Category', 'lifterlms' ),
		'taxonomy-memberhsip_tag':    __( 'Taxonomy Membership Tag', 'lifterlms' ),
	};

	return labels[ template ] ?? template;

}
