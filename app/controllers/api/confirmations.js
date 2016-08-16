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
				invite.markModified('confirmations.' + emailHash);
				invite.save(function (inviteSaveErr, result) {
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

							// search the DB for the next reward. Query and then use lodash's sort, 
							var nextRewardSearch = {recipient: 'inviter', score: { $gt: score }};
							Reward.find(nextRewardSearch, function(nextRewardErr, nextRewards) {
									var nextRewardSort = _.sortBy(nextRewards, function(reward) {
										return reward.score;
									});
									var nextReward = nextRewardSort[0];
									if (newRewards.length > 0) {
										user.achievedRewards = user.achievedRewards.concat(_.map(newRewards, '_id'));
										user.save();
									};
									emailservice.sendInviterConfirmation(user.email, req.body.email, score, newRewards, nextReward);
							});
						});
						// Send email to invitee
						var rewardInviteeSearch = {recipient: 'invitee'};
						Reward.find(rewardInviteeSearch, function(rewardErr, rewards) {
							if (rewards.length > 0) {
								emailservice.sendInviteeConfirmation(req.body.email, user.email, rewards); 
							};
						});
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