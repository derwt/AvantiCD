// Modules =================================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.set('view engine', 'pug'); // For using Pug: https://pugjs.org/api/getting-started.html

// Configuration ===========================

const PORT = process.env.PORT || 27017;
const db = require('./config/db');

// Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Set static files location
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public'));

// Require routes and catch-all redirect to index.html
require('./app/routes')(app);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

exports = module.exports = app;
