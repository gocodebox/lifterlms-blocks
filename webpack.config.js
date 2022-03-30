const generate = require( '@lifterlms/scripts/config/webpack.config' ),
	config   = generate( {
		css: [ 'blocks' ],
		js: [ 'blocks', 'blocks-backwards-compat' ],
	} );

config.module.rules.forEach( rule => {

	if ( '\\.(sc|sa)ss$' === rule.test.source ) {
		// Modify the sass-loader to ensure global vars are available to all scss files.
		rule.use[ 3 ].options.additionalData = '@import "./src/scss/_vars.scss";\n';
	}

} );

module.exports = config;
