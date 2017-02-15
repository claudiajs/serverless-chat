/*global require */
const jQuery = require('jquery');
jQuery.fn.channelSubscribeWidget = function (client) {
	'use strict';
	const container = jQuery(this),
		trySubscribing = function (channelName) {
			client.subscribe('chat/' + channelName);
		};
	container.find('[role=channel-selector]').on('click', function () {
		trySubscribing(jQuery(this).text());
	});
	container.find('[role=channel-creator]').on('click', function () {
		const topicField = jQuery('#topic');
		if (topicField.val()) {
			trySubscribing(topicField.val());
		} else {
			container.find('#create-group').addClass('has-error');
		}
	});
	return container;
};


