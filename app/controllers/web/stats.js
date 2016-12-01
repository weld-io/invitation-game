'use strict';

var _ = require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Invite = mongoose.model('Invite');

// Private methods

var getAllInvites = function (callback) {
	Invite.find()
		.sort({ dateCreated: -1 })
		.limit(200)
		.lean()
		.exec(callback);
};

var addUsersToInvites = function (invites, callback) {
	async.forEachOf(invites,
		function (invite, id, cb) {
			// For each
			User.findById(invite.user, function (userErr, user) {
				if (user) {
					invite.email = user.email;
				}
				cb();
			});
		},
		function () {
			// When all done
			callback(null, invites);
		}
	);
};

var calculateConfirmations = function (invites, callback) {
	async.forEachOf(invites,
		function (invite, id, cb) {
			// For each
			invite.confirmationCount = _.keys(invite.confirmations).length;
			cb();
		},
		function () {
			// When all done
			invites = _.orderBy(invites, 'confirmationCount', 'desc');
			callback(null, invites);
		}
	);
};


// Public methods

module.exports = {

	highscore: function (req, res, next) {

		async.waterfall([
				getAllInvites,
				addUsersToInvites,
				calculateConfirmations,
			],
			function (err, invites) {
				if (err) {
					return res.status(400).json(err);
				}
				else {
					res.render('stats/highscore', { title: 'Highscore', invites: invites });
				}
			}
		);

	}

}