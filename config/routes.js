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
	var emailApiController = require(config.root + '/app/controllers/api/email');

	var startController = require(config.root + '/app/controllers/web/start');
	var statsController = require(config.root + '/app/controllers/web/stats');
	var invitesWebController = require(config.root + '/app/controllers/web/invites');

	// API Routes
	router.get('/api/invites', invitesApiController.list);
	router.get('/api/invites/:code', invitesApiController.read);
	router.post('/api/invites', invitesApiController.create);
	// router.put('/api/invites/:id', invitesApiController.update);
	// router.delete('/api/invites/:id', invitesApiController.delete);
	router.post('/api/confirmations', confirmationsApiController.create);

	router.post('/api/email', emailApiController.send);


	// Web Routes
	router.get('/highscore', statsController.highscore);
	router.get('/:code', invitesWebController.click);
	router.get('/', startController.index);

};