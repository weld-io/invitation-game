'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Invite = mongoose.model('Invite');

module.exports = {

	list: function (req, res, next) {
		var searchQuery = {};
		if (req.query.from) {
			var currentTime = new Date();
			searchQuery = { dateCreated: { "$gte": new Date(req.query.from), "$lt": currentTime } };
		}

		Invite.find(searchQuery, null, { sort: {dateCreated: -1} }, function (err, invites) {
			if (err) {
				return res.status(400).json(err);
			}
			else {
				return res.json(invites);
			}
		});
	},

	read: function (req, res, next) {
		Invite.find({ code: req.params.code }, function (err, invite) {
			if (err) {
				return res.status(400).json(err);
			}
			else {
				return res.json(invite[0]);
			}
		});
	},

	// Create new invite
	create: function (req, res, next) {

		User.findOrCreate({ email: req.body.email }, { name: req.body.name }, function (userErr, user, created) {
			if (userErr) {
				return res.status(400).json(userErr);
			}
			else {
				var searchOptions = {};
				searchOptions.user = user._id;
				Invite.find(searchOptions).lean().exec(function (inviteErr, foundInvites) {
					if (foundInvites.length > 0) {
						var invite = _.cloneDeep(foundInvites[0]);
						invite.inviteUrl = process.env.ACCEPT_INVITE_URL + '/' + invite.code;
						delete invite.confirmations;
						return res.json(invite);
					}
					else {
						Invite.createNew(searchOptions, function (inviteErr, newInvite) {
							if (inviteErr) {
								return res.status(400).json(inviteErr);
							}
							else {
								// TODO: remove duplicate code
								var invite = _.cloneDeep(newInvite.toObject());
								invite.inviteUrl = process.env.ACCEPT_INVITE_URL + '/' + invite.code;
								delete invite.confirmations;
								return res.json(invite);
							}
						});						
					}
				});
			}
		});

	},

	// Update invite
	update: function (req, res, next) {
		Invite.update(
			{ _id: req.params.id },
			req.body,
			function (updateErr, numberAffected, rawResponse) {
				if (updateErr) {
					res.json(500, updateErr);
				}
				else {
					res.json(200, 'Updated invite ' + req.params.id);
				}
			}
		);
	},

	// Delete invite
	delete: function (req, res, next) {
		var searchParams;
		if (req.params.id === 'ALL') {
			searchParams = {};
		}
		else {
			searchParams = { _id: req.params.id }
		}

		Invite.remove(
			searchParams,
			function(inviteErr, numberAffected, rawResponse) {
				if (inviteErr) {
					res.json(500, inviteErr);
				}
				else {
					res.json(200, 'Deleted ' + numberAffected + ' invites');
				}
			}
		);
	}

}