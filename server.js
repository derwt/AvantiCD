// Modules =================================
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

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

// Require CID routes
const lookupRouter = require('./lookup.js');
app.use('/lookup', lookupRouter);

require('./app/routes')(app); // Catch-all redirect to index.html

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

// app.get('/', (req, res, next) => {
//     res.send('Hooray!');
// });

exports = module.exports = app;
