/**
 * -----------------------------------------------------------
 * versioner-extra
 * -----------------------------------------------------------
 *
 * Updates the version constant in the plugin main file.
 *
 * Usage: gulp versioner-extra -V 9.9.9
 */

var   gulp    = require( 'gulp' )
	, replace = require( 'gulp-replace' )
	, argv    = require( 'yargs' ).argv
	, gutil   = require( 'gulp-util' )
	, getVersion = require( process.cwd() + '/node_modules/lifterlms-lib-tasks/lib/getVersion' )
	, pkg = require( process.cwd() + '/package.json' )
;

gulp.task( 'versioner-extra', function( cb ) {

    let the_version = argv.V;

    the_version = getVersion( the_version, pkg.version );

    gutil.log( gutil.colors.blue( 'Updating extra file versions to `' + the_version + '`' ) );

	return gulp.src( [ './lifterlms-blocks.php'  ], { base: './' } )
		.pipe( replace( /'LLMS_BLOCKS_VERSION', '(\d+\.\d+\.\d+)(\-\D+\.\d+)?'/g, function( match, p1, p2, string ) {
	        // if there's a prerelease suffix (eg -beta.1) remove it entirely
	        if ( p2 ) {
	          match = match.replace( p2, '' );
	        }
			return match.replace( p1, the_version );
		} ) )
		.pipe( gulp.dest( './' ) );

	cb();

} );
