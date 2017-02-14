/*global module, CryptoJS */
/*eslint-disable new-cap */

//TODO: load CryptoJS using require

const sign = function (key, msg) {
		'use strict';
		const hash = CryptoJS.HmacSHA256(msg, key);
		return hash.toString(CryptoJS.enc.Hex);
	},
	sha256 = function (msg) {
		'use strict';
		const hash = CryptoJS.SHA256(msg);
		return hash.toString(CryptoJS.enc.Hex);
	},
	getSignatureKey = function (key, dateStamp, regionName, serviceName) {
		'use strict';
		const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key),
			kRegion = CryptoJS.HmacSHA256(regionName, kDate),
			kService = CryptoJS.HmacSHA256(serviceName, kRegion),
			kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
		return kSigning;
	};


module.exports = function sigV4Url(protocol, host, uri, service, region, accessKey, secretKey, sessionToken) {
	'use strict';
	const time = new Date().toISOString().split('T'),
		dateStamp = time[0].replace(/\-/g, ''),
		amzdate = dateStamp + 'T' + time[1].substring(0, 8).replace(/:/g, '') + 'Z',
		algorithm = 'AWS4-HMAC-SHA256',
		method = 'GET',
		credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request',
		canonicalQuerystring = //TODO: use querystring
			'X-Amz-Algorithm=AWS4-HMAC-SHA256' +
			'&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope) +
			'&X-Amz-Date=' + amzdate +
			'&X-Amz-SignedHeaders=host',
		canonicalHeaders = 'host:' + host + '\n',
		payloadHash = sha256(''),
		canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash,
		stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + sha256(canonicalRequest),
		signingKey = getSignatureKey(secretKey, dateStamp, region, service),
		signature = sign(signingKey, stringToSign);

	let signedQueryString = canonicalQuerystring + '&X-Amz-Signature=' + signature;
	if (sessionToken) {
		signedQueryString = signedQueryString + '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);
	}

	return protocol + '://' + host + uri + '?' + signedQueryString;
};
