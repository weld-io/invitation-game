/**
 * Application routes for REST
 */

'use strict';

var express = require('express');

module.exports = function (app, config) {

	var router = express.Router();
	app.use('/', router);

	// Controllers
	var invitesApiController = require(config.root + '/app/controllers/api/invites');
	var confirmationsApiController = require(config.root + '/app/controllers/api/confirmations');

	var startController = require(config.root + '/app/controllers/web/start');
	var invitesWebController = require(config.root + '/app/controllers/web/invites');

	// API Routes
	router.get('/api/invites', invitesApiController.list);
	router.get('/api/invites/:code', invitesApiController.read);
	router.post('/api/invites', invitesApiController.create);
	// router.put('/api/invites/:id', invitesApiController.update);
	// router.delete('/api/invites/:id', invitesApiController.delete);
	router.post('/api/confirmations', confirmationsApiController.create);

	//router.post('/api/email', );


	// Web Routes
	router.get('/:code', invitesWebController.click);
	router.get('/', startController.index);

};