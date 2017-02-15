/*global require, console */
/*eslint strict: ["error", "global"]*/
'use strict';
const AWS = require('aws-sdk'),
	postToEndpoint = function (endpoint, topic, message) {
		const iotdata = new AWS.IotData({endpoint: endpoint});
		return iotdata.publish({
			topic: topic,
			payload: message
		}).promise();
	},
	postToDefaultEndpoint = function (topic, message) {
		const iot = new AWS.Iot();
		return iot.describeEndpoint().promise().then(data => postToEndpoint(data.endpointAddress, topic, message));
	};

AWS.config.update({region: 'us-east-1'});
postToDefaultEndpoint('chat/Serverless', 'this is from a server')
	.then(console.log, e => console.error('error posting', e));


