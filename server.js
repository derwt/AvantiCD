const express = require('express');
const app = express();
const PORT = 27017;
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const URL = 'mongodb://localhost:27017'

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})

app.get('/', (req, res, next) => {
  res.send(__dirname + '/index.html');
})

// MongoClient.connect(URL, (err, client) => {
//   if (err) return;
//
//   const db = client.db('avantiCD');
//   const collection = db.collection('Customers');
//
//   collection.insert({CID: 9999, 'Phone Number': 650999999}, (err, result) => {
//     collection.find({CID: 9999}).toArray((err, docs) => {
//       console.log(docs[0])
//       client.close()
//     })
//   })
// })
