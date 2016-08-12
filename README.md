# The Invitation Game

API for a gamified invitation system built in Node.js.


## How to Run

Just start with:

	# Set password used in API requests
	export API_PASSWORD=MYPASSWORD

	grunt

Server will default to **http://localhost:3011**


## How to Test

	npm test


## How to Use

1) **Create invitation:** Generate a unique invitation code based on Inviter (+ Destination):

	curl -X POST -H "Content-Type: application/json" -d '{ "from": "inviter@weld.io" }' http://localhost:3011/api/invites

Fields:

* `from` **(required)**: the Inviters email. Inviter email address *is* stored in the database.
* `destination`: if you want to override the default Destination URL, specify URL here.
* `message`: used in the message to the Invitee.
* `to`: If you want to the Invitation Game to send the link via email. Comma-separated lists of 1+ email addresses to invite, e.g. `invitee@weld.io,invitee2@weld.io`. Invitee email addresses *are never* stored in the database.

JSON response:

	{
		"_id": "56c97aeba74d62b6e1895175",
		"code": "bo",
		"user": "56c8df5215e12e53e0c77bba",
		"destination": "https://www.weld.io",
		"__v": 0,
		"dateCreated": "2016-02-21T08:52:59.638Z"
	}

**Note:** The invitation code is generated with simple syllables. Code 0="ba", 1="be", 1000000="bebababa", etc.

2) **Distribute link:** Let the Inviter distribute the link `http://localhost:3011/[code]` via email, SMS, or copy link.

3) **Link is clicked:** Invitee clicks the link and is transported to _Destination_ with optional parameters. `inviteCode` is added to URL parameters.

4) **Create confirmation:** When Invitee signs up, confirm this to by using the `code` provided. Score is added to Inviter. Email is sent to Inviter.

	curl -X POST -H "Content-Type: application/json" -d '{ "code": "bo", "email": "invitee@weld.io" }' http://localhost:3011/api/confirmations

Fields:

* `code` **(required)**: the Invite code.
* `email` **(required)**: the Invitees email address. Invitee email addresses *are never* stored in the database.

JSON response:

	{
		"confirmations": {  
			"6f6a3e6c75de042f115f97aef6d7b537": {  
				"date": "2016-08-12T07:57:11.502Z"
			}
		},
		"_id": "56c97aeba74d62b6e1895175",
		"code": "bo",
		"user": "56c8df5215e12e53e0c77bba",
		"__v": 0,
		"dateCreated": "2016-02-21T08:52:59.638Z"
	}

5) **Trigger rewards:** Inviter’s score is accumulated, and rewards can be triggered at certain score levels. Rewards can be trigger web callbacks and/or email being sent.


## Implementation

Based on the [Yeoman Express generator](https://github.com/petecoop/generator-express) with the "MVC" option.
Built on Node.js, Express (with EJS) and MongoDB.


## Deploying on Heroku

	# Set up and configure app
	heroku create MYAPPNAME
	heroku addons:add mongolab
	heroku config:set NODE_ENV=production
