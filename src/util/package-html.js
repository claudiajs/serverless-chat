/*global require, __dirname, process, console*/
/*eslint strict: ["error", "global"]*/
'use strict';
const fs = require('fs'),
	path = require('path'),
	Handlebars = require('handlebars'),
	version = process.env.npm_package_version,
	packageName = process.env.npm_package_name,
	environment = process.env.npm_package_config_buildenv,
	rootPath = path.resolve(__dirname, '..', '..'),
	webSourcePath = path.resolve(rootPath, 'src', 'web'),
	readTemplateValues = function () {
		const envPath = path.resolve(rootPath, 'env', environment + '.json');
		try {
			return {
				version: version,
				environment: environment,
				config: JSON.parse(fs.readFileSync(envPath, 'utf8'))
			};
		} catch (e) {
			console.error('Error reading config file', envPath);
			console.error(`Please create that file or re-run with --${packageName}:buildenv=<ENV NAME>`);
			process.exit(1);
		}
	},
	processTemplate = function (fileName, templateValues) {
		console.log('building', fileName);
		const filePath = path.join(webSourcePath, fileName),
			source = fs.readFileSync(filePath, 'utf8'),
			template = Handlebars.compile(source),
			result = template(templateValues);
		fs.writeFileSync(path.resolve(rootPath, 'site', fileName), result, 'utf8');
	},
	isHtmlFile = function (fileName) {
		const filePath = path.join(webSourcePath, fileName),
			stat = fs.lstatSync(filePath);
		return stat.isFile() && path.extname(filePath) === '.html';
	};



console.log('======> BUILDING with', environment);
const templateValues = readTemplateValues();
fs.readdirSync(webSourcePath)
	.filter(isHtmlFile)
	.forEach(f => processTemplate(f, templateValues));
