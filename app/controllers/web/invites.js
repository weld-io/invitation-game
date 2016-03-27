'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Invite = mongoose.model('Invite');

// http://stackoverflow.com/questions/6953944/how-to-add-parameters-to-a-url-that-already-contains-other-parameters-and-maybe
var addParameter = function (url, parameterName, parameterValue, atStart) {
	var replaceDuplicates = true;
	if (url.indexOf('#') > 0) {
		var cl = url.indexOf('#');
		var urlhash = url.substring(url.indexOf('#'),url.length);
	}
	else {
		var urlhash = '';
		var cl = url.length;
	}
	var sourceUrl = url.substring(0, cl);

	var urlParts = sourceUrl.split("?");
	var newQueryString = "";

	if (urlParts.length > 1)
	{
		var parameters = urlParts[1].split("&");
		for (var i=0; (i < parameters.length); i++) {
			var parameterParts = parameters[i].split("=");
			if (!(replaceDuplicates && parameterParts[0] == parameterName))
			{
				if (newQueryString == "")
					newQueryString = "?";
				else
					newQueryString += "&";
				newQueryString += parameterParts[0] + "=" + (parameterParts[1]?parameterParts[1]:'');
			}
		}
	}
	if (newQueryString == "")
		newQueryString = "?";

	if (atStart) {
		newQueryString = '?'+ parameterName + "=" + parameterValue + (newQueryString.length>1?'&'+newQueryString.substring(1):'');
	}
	else {
		if (newQueryString !== "" && newQueryString != '?')
			newQueryString += "&";
		newQueryString += parameterName + "=" + (parameterValue?parameterValue:'');
	}
	return urlParts[0] + newQueryString + urlhash;
};

module.exports = {

	click: function (req, res, next) {
		// TODO: add email notification on click, and click count to Invite object
		Invite.find({ code: req.params.code }, function (inviteErr, foundInvites) {
			if (foundInvites.length > 0) {
				var invite = foundInvites[0];
				var redirectUrl;
				if (invite.destination)
					redirectUrl = invite.destination;
				else
					redirectUrl = 'http://weld.io';
				// Add parameters
				redirectUrl = addParameter(redirectUrl, 'inviteCode', invite.code);
				// Do the redirect
				//res.redirect(302, 'http://yourotherdomain.com' + req.path);
				res.render(
					'invites/click',
					{
						title: 'Invites - redirecting...',
						redirectUrl: redirectUrl,
					}
				);
			}
			else {
				res.render(
					'invites/notfound',
					{
						title: 'Invite not found',
					}
				);
			}
		});
	},

}