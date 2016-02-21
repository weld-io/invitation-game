'use strict';

var mongoose = require('mongoose'), Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');
var codegenerator = require('../lib/codegenerator');

var InviteSchema = new Schema({
	code: { type: String, unique: true, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
	dateCreated: { type: Date, default: Date.now },
	destination: {},
	message: { type: String },
});

InviteSchema.plugin(findOrCreate);

// Make new code
InviteSchema.statics.createNew = function (options, cb) {
	var Invite = this;
	this.count({}, function (err, count) {
		var newInvite = new Invite();
		for (var o in options) {
			newInvite[o] = options[o];
		}
		newInvite.code = codegenerator.generateCode(count);
		newInvite.save(cb);
	});
};

mongoose.model('Invite', InviteSchema);