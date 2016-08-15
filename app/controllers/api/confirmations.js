'use strict';

var _ = require('lodash');
var md5 = require('md5');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Invite = mongoose.model('Invite');
var Reward = mongoose.model('Reward');

var codegenerator = require('../../lib/codegenerator');
var emailservice = require('../../lib/emailservice');

module.exports = {

	// Create new confirmation
	create: function (req, res, next) {
		var searchQuery = {};
		searchQuery.code = req.body.code;
		Invite.find(searchQuery, function (inviteErr, foundInvites) {
			if (foundInvites.length > 0) {
				var invite = foundInvites[0];
				var emailHash = md5(req.body.email);
				invite.confirmations = invite.confirmations || {};
				invite.confirmations[emailHash] = { date: new Date };
				invite.save(function () {
					// Calculate score
					var score = _.keys(invite.confirmations).length;
					// Send email to Inviter
					User.findById(invite.user, function (err, user) {
						var rewardSearch = {recipient: 'inviter', score: { $lte: score }};
						Reward.find(rewardSearch, function(rewardErr, rewards) {
							user.achievedRewards = user.achievedRewards || [];
							var newRewards = _.filter(rewards, function(reward) {
								return (user.achievedRewards.indexOf(reward._id) === -1);
							});
							if (newRewards.length > 0) {
								user.achievedRewards = user.achievedRewards.concat(_.map(newRewards, '_id'));
								user.save();
							};
							emailservice.sendInviterConfirmation(user.email, req.body.email, score, newRewards);
						});
					}); 
					// Send email to invitee
					var rewardInviteeSearch = {recipient: 'invitee'};
					Reward.find(rewardInviteeSearch, function(rewardErr, rewards) {
						// See if invitee has unlocked a reward
						// or, see in inviter's invitations if this specific invite has been completed
						// if unlocked, send a confirmation, and send the confirmation email
						console.log("Invite: ", invite);
					});
					return res.json({ invite: invite, score: score });
				});
			}
			else {
				return res.status(404).json({ message: 'Invite not found' });				
			}
		});
	},

}