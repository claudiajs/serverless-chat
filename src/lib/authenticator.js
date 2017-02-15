/*global module, require */
const AWS = require('aws-sdk');
module.exports = function Authenticator(cognitoIdentityPoolId) {
	'use strict';
	const self = this;
	self.getAnonymousCredentials = function () {
		AWS.config.region = cognitoIdentityPoolId.split(':')[0];
		return new Promise(function (resolve, reject) {
			const credentials = new AWS.CognitoIdentityCredentials({
				IdentityPoolId: cognitoIdentityPoolId
			});
			credentials.get(function (err) {
				if (err) { // TODO: Promisify
					return reject(err);
				}
				resolve(credentials);
			});
		});
	};
};

