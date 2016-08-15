'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	name: { type: String },
	dateCreated: { type: Date, default: Date.now },
	score: { type: Number },
	achievedRewards: [String],
});

UserSchema.plugin(findOrCreate);

mongoose.model('User', UserSchema);