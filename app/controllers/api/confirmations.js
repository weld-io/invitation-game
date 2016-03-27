'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');

var codegenerator = require('../../lib/codegenerator');

var User = mongoose.model('User');
var Invite = mongoose.model('Invite');

module.exports = {

	// Create new confirmation
	create: function (req, res, next) {
		var searchQuery = {};
		searchQuery.code = req.body.code;
		Invite.find(searchQuery, function (inviteErr, foundInvites) {
			if (foundInvites.length > 0) {
				var invite = foundInvites[0];
				var emailHash = codegenerator.generateHash(req.body.user);
				invite.confirmations = invite.confirmations || {};
				invite.confirmations[emailHash] = { date: new Date };
				invite.save(function () {
					return res.json(invite);
				});
			}
			else {
				return res.status(404).json({ message: 'Invite not found' });				
			}
		});

	},

}