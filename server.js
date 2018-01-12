// Modules =================================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Configuration ===========================

const PORT = process.env.PORT || 27017;
const db = require('./config/db');
require('./app/routes')(app); // Catch-all redirect to index.html

// Parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Set static files location
app.use(express.static(__dirname + '/public'));

// Require CID routes
const lookupRouter = require('./lookup.js');
app.use('/lookup', lookupRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

app.get('/', (req, res, next) => {
    res.send('Hooray!');
});

exports = module.exports = app;
