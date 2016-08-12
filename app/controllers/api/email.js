'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Invite = mongoose.model('Invite');

var emailservice = require('../../lib/emailservice');

module.exports = {

	// Send new email invite
	send: function (req, res, next) {
		var searchQuery = {};
		searchQuery.code = req.body.code;
		Invite.find(searchQuery, function (inviteErr, foundInvites) {
			if (foundInvites.length > 0) {
				var invite = foundInvites[0];
				// Send email to Inviter
				User.findById(invite.user, function (userErr, user) {
					emailservice.sendInviteeInvite(req.body.email, user.email, req.body.code, req.body.message);
					return res.status(200).json({ message: 'OK' });
				});
			}
			else {
				return res.status(404).json({ message: 'Invite not found' });				
			}
		});
	},

}