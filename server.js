var config = require('./config/config');
var app = require('./app');

console.log('invitation-game running on http://localhost:' + (process.env.PORT || config.port));
app.listen(process.env.PORT || config.port);