/*global module, require */
const getRegionFromGatewayName = require('./get-region-from-gateway-name'),
	sigV4Url = require('./sigv4url');
module.exports = function generateSignedWebsocketURL(credentials, gatewayName) {
	'use strict';
	return sigV4Url(
		'wss',
		gatewayName,
		'/mqtt',
		'iotdevicegateway',
		getRegionFromGatewayName(gatewayName),
		credentials.accessKeyId,
		credentials.secretAccessKey,
		credentials.sessionToken
	);
};
