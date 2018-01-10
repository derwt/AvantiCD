const express = require('express')
const app = express()
const PORT = 27017
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const URL = 'mongodb://localhost:27017'

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res, next) => {
  console.log(req.body)
})

MongoClient.connect(URL, (err, client) => {
  if (err) return console.log(err);

  var db = client.db('avantiCD');
  const collection = db.collection('Customers');

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })

  // app.post('/quotes', (req, res, next) => {
  //   collection.insert(req.body, (err, res, next) => {
  //     if (err) return console.log(err)
  //
  //     console.log('saved to database')
  //     res.redirect('/')
  //   })
  // })
  app.post('/quotes', (req, res, next) => {
    collection.insert({CID: 9998, 'Phone Number': 650999999}, (err, result) => {
      collection.find({CID: 9998}).toArray((err, docs) => {
        console.log(docs[0]);
        client.close();
      });
    });
  })

})
