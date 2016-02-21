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

		User.findOrCreate({ email: req.body.email }, function (userErr, user, created) {
			if (userErr) {
				return res.status(400).json(userErr);
			}
			else {
				var options = _.cloneDeep(req.body);
				delete options.email;
				options.user = user._id;
				Invite.find(options, function (inviteErr, foundInvites) {
					if (foundInvites.length > 0) {
						return res.json(foundInvites[0]);
					}
					else {
						Invite.createNew(options, function (inviteErr, newInvite) {
							if (inviteErr) {
								return res.status(400).json(inviteErr);
							}
							else {
								return res.json(newInvite);
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