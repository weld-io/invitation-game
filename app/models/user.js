'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
	email: { type: String, unique: true, required: true },
	dateCreated: { type: Date, default: Date.now },
	score: { type: Number },
});

UserSchema.plugin(findOrCreate);

mongoose.model('User', UserSchema);