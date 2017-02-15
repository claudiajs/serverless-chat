/*global require */
const jQuery = require('jquery');
jQuery.fn.messageFormWidget = function (client) {
	'use strict';
	const messageForm = jQuery(this),
		messageField = messageForm.find('[role=messageText]');
	messageForm.on('submit', () => {
		client.post(messageField.val());
	});
	client.addEventListener('sent', function () {
		messageField.val('');
	});
};
