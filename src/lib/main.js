/*global document, require, console */

const config = require('config'),
	Authenticator = require('./authenticator'),
	MQTTClient = require('./mqtt-client'),
	client = new MQTTClient({log: true}),
	jQuery = require('jquery'),
	authenticator = new Authenticator(config.cognitoIdentityPoolId),
	showStatus = function (string) {
		'use strict';
		const statusSpan = document.getElementById('status');
		statusSpan.innerHTML = string;
	},
	showError = function (e) {
		'use strict';
		const errorMessage = e && (typeof e === 'string' ? e : (e.stack || e.message || JSON.stringify(e)));
		showStatus('Error: ' + errorMessage);
		jQuery('<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> ' +
				'<strong>Error:</strong> ' + errorMessage +
			'</div>').alert().appendTo(jQuery('[role=error-panel]'));
	},
	appendMessage = function (message) {
		'use strict';
		jQuery('<li>').text(message).appendTo('#messageList');
	},
	initPage = function () {
		'use strict';
		const connectButton = document.getElementById('connect'),
			messageForm = document.getElementById('messageForm'),
			trySubscribing = function (channelName) {
				jQuery('[role=channel-name]').text(channelName);
				client.subscribe('chat/' + channelName).then(() => {
					jQuery('#tab-messages').tab('show');
				}, (e) => {
					showError('could not subscribe', e);
				});
			};

		connectButton.addEventListener('click', () => {
			authenticator
				.getAnonymousCredentials()
				.then(credentials => client.init(credentials, config.iotGatewayName))
				.catch(showError);
		});
		jQuery('form').on('submit', (evt) => {
			evt.preventDefault();
		});
		messageForm.addEventListener('submit', () => {
			const messageField = document.getElementById('messageText');
			client.post(messageField.value);
		});

		client.addEventListener('error', showError);

		client.addEventListener('connected', () => showStatus('connected'));
		client.addEventListener('connecting', () => showStatus('connecting...'));
		client.addEventListener('disconnected', () => showStatus('disconnected'));

		client.addEventListener('received', appendMessage);
		client.addEventListener('sent', function () {
			const messageField = document.getElementById('messageText');
			messageField.value = '';
		});

		jQuery('[role=tab-button]').on('click', function (e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});

		client.addEventListener('connected', function () {
			jQuery('#channel-select').tab('show');
		});

		client.addEventListener('connected', (credentials) => {
			console.log('connected as', credentials);
			jQuery('[role=account-id]').text(credentials.identityId);
		});

		jQuery('[role=channel-selector]').on('click', function () {
			trySubscribing(jQuery(this).text());
		});
		jQuery('[role=channel-creator]').on('click', function () {
			const topicField = jQuery('#topic');
			if (topicField.val()) {
				trySubscribing(topicField.val());
			} else {
				jQuery('#create-group').addClass('has-error');
			}
		});

		client.addEventListener('disconnected', () => {
			jQuery('#sign-out').tab('show');
			showError('You got disconnected');
		});

	};

require('bootstrap');

document.addEventListener('DOMContentLoaded', initPage);
