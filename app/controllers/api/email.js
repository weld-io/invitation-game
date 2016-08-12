'use strict';

module.exports = {

	// Send new email invite
	send: function (req, res, next) {
		return res.status(200).json({ message: 'All is good' });
	},

}