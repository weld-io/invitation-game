var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	env = process.env.NODE_ENV || 'development';

var config = {

	development: {
		root: rootPath,
		app: {
			name: 'invitation-game'
		},
		port: 3011,
		db: 'mongodb://localhost/invitation-game-development'
		
	},

	test: {
		root: rootPath,
		app: {
			name: 'invitation-game'
		},
		port: 3000,
		db: 'mongodb://localhost/invitation-game-test'
		
	},

	production: {
		root: rootPath,
		app: {
			name: 'invitation-game'
		},
		port: 3000,
		db: process.env.MONGODB_URI || 'mongodb://localhost/invitation-game-production'

	}

};

module.exports = config[env];