'use strict';

var nodemailer = require("nodemailer");
var EmailTemplate = require('email-templates').EmailTemplate;
var sesTransport = require('nodemailer-ses-transport');
var transport = nodemailer.createTransport(
	sesTransport({
		accessKeyId: process.env.SES_ACCESSKEY,
		secretAccessKey: process.env.SES_SECRET,
		region: process.env.SES_REGION,
	})
);

var config = require('../config/config');

var weldDefaultEmail = "Weld <contact@weld.io>";

var VIEWS_PATH = 'app/views/';
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
	VIEWS_PATH = config.root + '/views/';
}

var sendTemplateUserInvited = transport.templateSender(
	new EmailTemplate(VIEWS_PATH + 'email/share-project'), // path to template
	{
		from: weldDefaultEmail, // sender address
	}
);

module.exports.sendUserInvited = function (sender, recipient, project) {
	// use template based sender to send a message
	sendTemplateUserInvited(
		{
			replyTo: sender, // sender address
			to: recipient, // list of receivers
			// EmailTemplate renders html and text but no subject so we need to set it manually either here or in the defaults section of templateSender()
			subject: "Check out “{project.name}” by {sender.email}".replace(/{project.name}/g, project.name).replace(/{sender.email}/g, sender),
		},
		{
			project: project,
			projectScreenshot: projects.getScreenshotUrl(project, project._id),
			sender: { email: sender }
		},
		function (err, info) {
			if (err) {
			   console.log('Mailer error:', err);
			}
			else {
				//console.log('sendUserInvited sent');
			}
		}
	);
};