'use strict';

var test = require('tape');
var request = require('supertest');

var app = require('../app');

// https://github.com/substack/tape
test('Correct invites returned', function (t) {
	request(app)
	.get('/api/invites')
	.expect('Content-Type', /json/)
	.expect(200)
	.end(function (err, res) {
		t.error(err, 'No error');
		t.ok(res.body.length, 'Returned invites list');
		t.ok(res.body[0].code, 'Invite 0 existed');
		//t.same(res.body, expectedUsers, 'Users as expected');
		t.end();
	});
});