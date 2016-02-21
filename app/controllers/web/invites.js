'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Invite = mongoose.model('Invite');

module.exports = {

	click: function (req, res, next) {
		// TODO: add email notification on click, and click count to Invite object
		Invite.find({ code: req.params.code }, function (inviteErr, foundInvites) {
			if (foundInvites.length > 0) {
				var invite = foundInvites[0];
				var redirectUrl;
				if (invite.destination && invite.destination.url)
					redirectUrl = invite.destination.url;
				else
					redirectUrl = 'http://weld.io';
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