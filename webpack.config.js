/**
 * Webpack config
 *
 * @package LifterLMS_Blocks/Scripts/Dev
 *
 * @since 1.8.0
 * @version 1.8.0
 */

const
	cssExtract = require( 'mini-css-extract-plugin' ),
	config     = require( '@wordpress/scripts/config/webpack.config' ),
	depExtract = require( '@wordpress/dependency-extraction-webpack-plugin' )
	path       = require( 'path' );

module.exports = {
	...config,
	entry: {
		blocks: path.resolve( process.cwd(), 'assets/src/', 'blocks.js' ),
	},
	output: {
		filename: `js/llms-[name].js`,
		path: path.resolve( process.cwd(), 'assets/' ),
	},
	module: {
		...config.module,
		rules: [
			...config.module.rules,
			{
				test: /\.s[ac]ss$/i,
				use: [
					cssExtract.loader,
					'css-loader',
					{
						loader: 'sass-loader',
						options: {
							prependData: '@import "./assets/src/_vars.scss";\n',
						},
					},
				],
		},
		],
	},
	plugins: [
		...config.plugins,
		new cssExtract( {
			filename: `css/llms-[name].css`,
		} ),
		new depExtract( {
			injectPolyfill: true,
			requestToExternal: request => {
				if ( 'llms-quill' === request ) {
					return 'Quill';
				} else if ( 'llms-izimodal' === request ) {
					return [ 'jQuery', 'iziModal' ];
				} else if ( request.startsWith( 'llms/' ) || request.startsWith( 'LLMS/' ) ) {
					return request.split( '/' );
				}
			},
			requestToHandle: request => {
				if ( request.startsWith( 'llms/' ) || request.startsWith( 'LLMS/' ) ) {
					return 'llms';
				}
			}
		} ),
	],
};
