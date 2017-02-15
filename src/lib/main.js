/*global document, require */

const config = require('config'),
	Authenticator = require('./authenticator'),
	MQTTClient = require('./mqtt-client'),
	client = new MQTTClient({log: true}),
	authenticator = new Authenticator(config.cognitoIdentityPoolId),
	showStatus = function (string) {
		'use strict';
		const statusSpan = document.getElementById('status');
		statusSpan.innerHTML = string;
	},
	showError = function (e) {
		'use strict';
		const errorMessage = e && (e.stack || e.message || JSON.stringify(e));
		showStatus('Error: ' + errorMessage);
	},
	appendMessage = function (message) {
		'use strict';
		const messageList = document.getElementById('messageList');
		messageList.innerHTML +=  '<li>' + message + '</li>';
	},
	initPage = function () {
		'use strict';
		const connectButton = document.getElementById('connect'),
			subscribeForm = document.getElementById('subscribe'),
			messageForm = document.getElementById('messageForm');

		connectButton.addEventListener('click', () => {
			authenticator
				.getAnonymousCredentials()
				.then(credentials => client.init(credentials, config.iotGatewayName))
				.catch(showError);
		});
		subscribeForm.addEventListener('submit', (evt) => {
			const topicField = document.getElementById('topic');
			client.subscribe(topicField.value);
			evt.preventDefault();
		});
		messageForm.addEventListener('submit', (evt) => {
			const messageField = document.getElementById('messageText');
			client.post(messageField.value);
			evt.preventDefault();
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
	};

document.addEventListener('DOMContentLoaded', initPage);
