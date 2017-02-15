/*global document, require */

require('./status-widget');
require('./message-form-widget');
require('./message-list-widget');
require('./channel-subscribe-widget');
const config = require('config'),
	Authenticator = require('./authenticator'),
	MQTTClient = require('./mqtt-client'),
	client = new MQTTClient({log: true}),
	jQuery = require('jquery'),
	authenticator = new Authenticator(config.cognitoIdentityPoolId),
	showError = function (e) {
		'use strict';
		const errorMessage = e && (typeof e === 'string' ? e : (e.stack || e.message || JSON.stringify(e)));
		jQuery('<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button> ' +
				'<strong>Error:</strong> ' + errorMessage +
			'</div>').alert().appendTo(jQuery('[role=error-panel]'));
	},
	initPage = function () {
		'use strict';
		const connectButton = document.getElementById('connect');

		jQuery('form').on('submit', evt => evt.preventDefault());
		jQuery('#status').statusWidget(client);
		jQuery('#messageForm').messageFormWidget(client);
		jQuery('#messageList').messageListWidget(client);
		jQuery('#channels').channelSubscribeWidget(client);


		connectButton.addEventListener('click', () => {
			authenticator
				.getAnonymousCredentials()
				.then(credentials => client.init(credentials, config.iotGatewayName))
				.catch(showError);
		});

		client.addEventListener('error', showError);

		jQuery('[role=tab-button]').on('click', function (e) {
			e.preventDefault();
			jQuery(this).tab('show');
		});

		client.addEventListener('subscribed', function () {
			jQuery('#tab-messages').tab('show');
		});
		client.addEventListener('connected', function () {
			jQuery('#channel-select').tab('show');
		});

		client.addEventListener('connected', (credentials) => {
			jQuery('[role=account-id]').text(credentials.identityId);
		});

		client.addEventListener('subscribed subscribing', function (channelName) {
			jQuery('[role=channel-name]').text(channelName);
		});

		client.addEventListener('disconnected', () => {
			jQuery('#sign-out').tab('show');
			showError('You got disconnected');
		});

	};

require('bootstrap');

document.addEventListener('DOMContentLoaded', initPage);
