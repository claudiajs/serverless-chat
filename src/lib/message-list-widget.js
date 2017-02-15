/*global require */
const jQuery = require('jquery');
jQuery.fn.messageListWidget = function (client) {
	'use strict';
	const messageList = jQuery(this),
		appendMessage = function (message) {
			jQuery('<li>').text(message).appendTo(messageList);
		};

	client.addEventListener('received', appendMessage);
	client.addEventListener('subscribed', () => messageList.empty());
	return messageList;
};
