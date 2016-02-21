# The Invitation Game

Viral invitation system.

## Usage

...

## How to Run

Just start with:

	grunt

Server will default to **http://localhost:3011**

## API

Create new invite:

	curl -X POST -H "Content-Type: application/json" -d '{ "email": "test@weld.io", "destination": { "url": "https://www.weld.io" } }' http://localhost:3011/api/invites

Update invite:

	curl -X PUT -H "Content-Type: application/json" -d '{ "name": "my_new_invite", "redirectUrl": "https://duckduckgo.com" }' http://localhost:3011/api/invites/548cbb2b1ad50708212193d8

Delete invite:

	curl -X DELETE http://localhost:3011/api/invites/5477a6f88906b9fc766c843e

Delete all invites:

	curl -X DELETE http://localhost:3011/api/invites/ALL

## Implementation

Based on the [Yeoman Express generator](https://github.com/petecoop/generator-express) with the "MVC" option.
Built on Node.js, Express (with EJS) and MongoDB.

## Deploying on Heroku

	# Set up and configure app
	heroku create MYAPPNAME
	heroku addons:add mongolab
	heroku config:set NODE_ENV=production

	# Set password used in API requests
	heroku config:set MYAPPNAME_PASSWORD=MYPASSWORD
