# The Invitation Game

Viral invitation system.

## How to Run

Just start with:

	grunt

Server will default to **http://localhost:3011**

## How to Test

	npm test

## How to Use

1) Generate unique invitation code based on Inviter + destination:

	curl -X POST -H "Content-Type: application/json" -d '{ "email": "test@weld.io", "destination": { "url": "https://www.weld.io" } }' http://localhost:3011/api/invites

JSON response:

	{"_id":"56c97aeba74d62b6e1895175","code":"bo","user":"56c8df5215e12e53e0c77bba","destination":{"url":"https://www.weld.io"},"__v":0,"dateCreated":"2016-02-21T08:52:59.638Z"}

**Notes**:

* Inviter’s email *is* stored in the database.
* The invitation code is generated with simple syllables. Code 0="ba", 1="be", 1000000="bebababa", etc.

2) Distribute the link `http://localhost:3011/[code]` via email, sms, copy link.

3) Invitee clicks the link and is transported to _destination_ with optional parameters. `inviteCode` is added to URL parameters.

4) When Invitee signs up, confirm this to Invitation Game using the `inviteCode` provided. Score is added to Inviter. Email is sent to Inviter.

	curl -X POST -H "Content-Type: application/json" -d '{ "code": "hubabuba", "email": "test@weld.io" }' http://localhost:3011/api/confirmations

**Note**: Invitee’s email is *not* stored in the database.

5) Inviter’s score is accumulated, and rewards can be triggered at certain score levels. Rewards can be trigger web callbacks and/or email being sent.


## API

Create new invite:

	curl -X POST -H "Content-Type: application/json" -d '{ "email": "test@weld.io", "destination": { "url": "https://www.weld.io" } }' http://localhost:3011/api/invites

Create new confirmation:

	curl -X POST -H "Content-Type: application/json" -d '{ "code": "hubabuba", "email": "test@weld.io" }' http://localhost:3011/api/confirmations


## Implementation

Based on the [Yeoman Express generator](https://github.com/petecoop/generator-express) with the "MVC" option.
Built on Node.js, Express (with EJS) and MongoDB.


## Deploying on Heroku

	# Set up and configure app
	heroku create MYAPPNAME
	heroku addons:add mongolab
	heroku config:set NODE_ENV=production