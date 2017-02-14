/*global module, Paho, console, require */
//TODO: require PAHO
const observable = require('./observable'),
	generateSignedWebsocketURL = require('./generate-signed-websocket-url');
module.exports = function MQTTClient(options) {
	'use strict';
	observable(this);
	let userCredentials,
		pahoClient,
		currentTopic;
	const self = this,
		shouldLog = options && options.log,
		log = function (message, arg) {
			if (!shouldLog) {
				return;
			}
			console.log(message, arg);
		},
		onConnect = function (args) {
			log('connected', args);
			self.dispatchEvent('connected');
		},
		onFailure = function (err) {
			log('error ===>', err);
			self.dispatchEvent('error', err);
		},
		onMessage = function (message) {
			log('message ===>', JSON.stringify(message.payloadString));
			self.dispatchEvent('received', message.payloadString);
		},
		onDisconnect = function (err) {
			log('disconnected', err);
			currentTopic = undefined;
			self.dispatchEvent('disconnected', err);
		},
		onMessageDelivered = function (deliveredMessage) {
			log('sent', deliveredMessage);
			self.dispatchEvent('internal:delivered', deliveredMessage);
			self.dispatchEvent('sent', deliveredMessage.payloadString);
		};

	self.init = function (credentials, iotGatewayName) {
		const requestUrl = generateSignedWebsocketURL(credentials, iotGatewayName),
			clientId = credentials.identityId.replace('.', ''),
			connectOptions = {
				onSuccess: onConnect,
				useSSL: true,
				timeout: 3,
				mqttVersion: 4,
				onFailure: onFailure
			};

		pahoClient = new Paho.MQTT.Client(requestUrl, clientId);
		userCredentials = credentials;
		self.dispatchEvent('connecting');
		pahoClient.connect(connectOptions);
		pahoClient.onMessageArrived = onMessage;
		pahoClient.onConnectionLost = onDisconnect;
		pahoClient.onMessageDelivered = onMessageDelivered;
	};
	self.subscribe = function (topicName) {
		self.dispatchEvent('subscribing');
		return new Promise(function (resolve, reject) {
			if (!pahoClient) {
				reject('not connected');
			};
			if (!topicName) {
				reject('cannot subscribe to empty topic');
			};
			const onSubscribeSuccess = function () {
					currentTopic = topicName;
					log('subscribed to ' + currentTopic);
					resolve(topicName);
				},
				onSubscribeFail = function (error) {
					log('failed to subscribe to ' + topicName);
					reject(error.errorCode || error);
				};
			if (currentTopic) {
				pahoClient.unsubscribe(currentTopic);
			}
			pahoClient.subscribe(topicName, {
				onSuccess: onSubscribeSuccess,
				onFailure: onSubscribeFail
			});
		}).then(function () {
			return self.post('{"id":"' + userCredentials.identityId + '"}');
		});
	};
	self.post = function (messageText) {
		return new Promise(function (resolve, reject) {
			if (!pahoClient) {
				throw 'not connected';
			};
			if (!currentTopic) {
				throw 'not subscribed to a channel';
			};

			const messageSent = function () {
					unsubscribe(); //eslint-disable-line no-use-before-define
					resolve();
				},
				messageError = function (e) {
					unsubscribe(); //eslint-disable-line no-use-before-define
					reject(e);
				},
				subscribe = function () {
					self.addEventListener('error', messageError);
					self.addEventListener('internal:delivered', messageSent);
				},
				unsubscribe = function () {
					self.removeEventListener('error', messageError);
					self.removeEventListener('internal:delivered', messageSent);
				};

			subscribe();
			const message = new Paho.MQTT.Message(messageText);
			message.destinationName = currentTopic;
			pahoClient.send(message);
		});
	};

};
