'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;

var RewardSchema = new Schema({
	recipient: { type: String, enum: ['inviter', 'invitee'] },
	score: { type: Number },
	dateCreated: { type: Date, default: Date.now },
	description: {type: String},
	message: {type: String},
	claimInstructions: {type:String},
});

mongoose.model('Reward', RewardSchema);