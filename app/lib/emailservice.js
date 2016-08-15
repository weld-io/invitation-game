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

var defaultSenderEmail = process.env.EMAILSENDER || 'Default Sender <info@defaultwebsite.com>';
var appName = process.env.APP_NAME || "Default App Name";
var appDescription = process.env.APP_DESCRIPTION;
var appSendInviteUrl = process.env.SEND_INVITE_URL || "http://invites.defaultwebsite.com";
var appAcceptInviteUrl = process.env.ACCEPT_INVITE_URL || "http://invites.defaultwebsite.com";

var VIEWS_PATH = 'app/views/';


// ----- Email to Inviter with Confirmation -----

var sendTemplateInviterConfirmation = transport.templateSender(
	new EmailTemplate(VIEWS_PATH + 'email/inviter-confirmation'), // path to template
	{
		from: defaultSenderEmail, // sender address
	}
);

module.exports.sendInviterConfirmation = function (inviterEmail, inviteeEmail, score, rewards, callback) {
	// use template based sender to send a message
	if (process.env.EMAILSENDER) {
		sendTemplateInviterConfirmation(
			{
				//replyTo: sender, // sender address
				to: inviterEmail, // list of receivers
				// EmailTemplate renders html and text but no subject so we need to set it manually either here or in the defaults section of templateSender()
				subject: "{appName} invites: {inviteeEmail} just signed up - you have {score} points!"
					.replace(/{appName}/g, appName)
					.replace(/{inviteeEmail}/g, inviteeEmail)
					.replace(/{score}/g, score),
			},
			{
				appName: appName,
				appSendInviteUrl: appSendInviteUrl,
				appAcceptInviteUrl: appAcceptInviteUrl,
				inviteeEmail: inviteeEmail,
				score: score,
				rewards: rewards,
			},
			function (err, results) {
				if (err) {
					console.log('Mailer error:', err);
				}
				else {
					console.log('sendInviterConfirmation sent to ' + inviterEmail);
				}
				if (callback) callback(err, results);
			}
		);			
	}
};

// ----- Email to Invitee with Invite -----

var sendTemplateInviteeInvite = transport.templateSender(
	new EmailTemplate(VIEWS_PATH + 'email/invitee-invite'), // path to template
	{
		from: defaultSenderEmail, // sender address
	}
);

module.exports.sendInviteeInvite = function (inviteeEmail, inviterEmail, code, message, callback) {
	// use template based sender to send a message
	if (process.env.EMAILSENDER) {
		sendTemplateInviteeInvite(
			{
				replyTo: inviterEmail, // sender address
				to: inviteeEmail, // list of receivers
				// EmailTemplate renders html and text but no subject so we need to set it manually either here or in the defaults section of templateSender()
				subject: "{inviterEmail} has invited you to {appName}"
					.replace(/{appName}/g, appName)
					.replace(/{inviterEmail}/g, inviterEmail),
			},
			{
				appName: appName,
				appDescription: appDescription,
				appSendInviteUrl: appSendInviteUrl,
				appAcceptInviteUrl: appAcceptInviteUrl + '/' + code,
				inviterEmail: inviterEmail,
				code: code,
				message: message,
			},
			function (err, results) {
				if (err) {
					console.log('Mailer error:', err);
				}
				else {
					console.log('sendInviteeInvite sent to ' + inviteeEmail);
				}
				if (callback) callback(err, results);
			}
		);			
	}
};

// ----- Email to Invitee with Confirmation -----

var sendTemplateInviteeConfirmation = transport.templateSender(
	new EmailTemplate(VIEWS_PATH + 'email/invitee-confirmation'), // path to template
	{
		from: defaultSenderEmail, // sender address
	}
);

module.exports.sendInviteeConfirmation = function (inviteeEmail, inviterEmail, message, callback) {
	// use template based sender to send a message
	if (process.env.EMAILSENDER) {
		sendTemplateInviteeConfirmation(
			{
				replyTo: inviterEmail, // sender address
				to: inviteeEmail, // list of receivers
				// EmailTemplate renders html and text but no subject so we need to set it manually either here or in the defaults section of templateSender()
				subject: "Your {appName} reward has been unlocked!"
					.replace(/{appName}/g, appName)
					.replace(/{inviterEmail}/g, inviterEmail),
			},
			{
				appName: appName,
				appDescription: appDescription,
				appSendInviteUrl: appSendInviteUrl,
				appAcceptInviteUrl: appAcceptInviteUrl,
				inviterEmail: inviterEmail,
				message: message,
			},
			function (err, results) {
				if (err) {
					console.log('Mailer error:', err);
				}
				else {
					console.log('sendInviteeConfirmation sent to ' + inviteeEmail);
				}
				if (callback) callback(err, results);
			}
		);			
	}
};