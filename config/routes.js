/**
 * Application routes for REST
 */

'use strict';

var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Controllers
	var startController = require(config.root + '/app/controllers/web/start');
	var apiInvitesController = require(config.root + '/app/controllers/api/invites');
	var webInvitesController = require(config.root + '/app/controllers/web/invites');

	// API Routes
	router.get('/api/invites', apiInvitesController.list);
	router.get('/api/invites/:code', apiInvitesController.read);
	router.post('/api/invites', apiInvitesController.create);
	// router.put('/api/invites/:id', apiInvitesController.update);
	// router.delete('/api/invites/:id', apiInvitesController.delete);

	// Web Routes
	router.get('/:code', webInvitesController.click);

	router.get('/', startController.index);

};