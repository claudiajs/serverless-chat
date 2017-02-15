/*global require */
const jQuery = require('jquery');
jQuery.fn.statusWidget = function (client) {
	'use strict';
	const elements = jQuery(this),
		showStatus = function (string) {
			elements.text(string);
		},
		showError = function (e) {
			const errorMessage = e && (typeof e === 'string' ? e : (e.stack || e.message || JSON.stringify(e)));
			showStatus('Error: ' + errorMessage);
		};

	client.addEventListener('connected', () => showStatus('connected'));
	client.addEventListener('connecting', () => showStatus('connecting...'));
	client.addEventListener('disconnected', () => showStatus('disconnected'));
	client.addEventListener('error', showError);
	return elements;
};
