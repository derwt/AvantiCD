const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 27017;
const db = require('./config/db');

// Require CID routes
const lookupRouter = require('./lookup.js');
app.use('/lookup', lookupRouter);

app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })

  app.get('/', (req, res, next) => {
      res.send('Hooray!');
  });
