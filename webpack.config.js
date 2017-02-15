/*global require, module, __dirname, process, console */
const path = require('path'),
	webpack = require('webpack'),
	env = process.env.npm_package_config_buildenv,
	packageName = process.env.npm_package_name,
	BabiliPlugin = require('babili-webpack-plugin'),
	plugins = [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		})
	];

if (!env) {
	throw `package buildenv is not defined, aborting. Please run from NPM and optionally specify the build environment using --${packageName}:buildenv=<ENV>`;
}
console.log('=====> webpack building for ' + env);
//build minimised if prod/staging
if (env !== 'dev') {
	plugins.push(new BabiliPlugin());
}
module.exports = {
	entry: path.resolve(__dirname, 'src', 'lib', 'main.js'),
	devtool: 'source-map',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'site', process.env.npm_package_version)
	},
	plugins: plugins,
	resolve: {
		alias: {
			config: path.join(__dirname, 'env', env + '.json')
		}
	}
};
