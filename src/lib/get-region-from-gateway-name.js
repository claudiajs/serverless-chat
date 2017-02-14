/*global module */
module.exports = function getRegionFromGatewayName(gatewayName) {
	'use strict';
	return gatewayName.split('.')[2];
};
