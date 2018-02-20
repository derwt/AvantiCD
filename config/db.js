const mongoose = require('mongoose');
const Promise =  require('bluebird');
// const URI = 'mongodb://localhost:27017'; // Local DB
const URI = 'mongodb://derwt:ryanthompson@'+ // Atlas (Cloud DB) 
'avanticd-shard-00-00-s9cbj.mongodb.net:27017'+
',avanticd-shard-00-01-s9cbj.mongodb.net:27017,'+
'avanticd-shard-00-02-s9cbj.mongodb.net:27017'+
'/avantiCD?ssl=true&replicaSet=AvantiCD-shard-0&authSource=admin';

//Set up default mongoose connection
var mongoDB = URI;
mongoose.connect(mongoDB, {
  useMongoClient: true
});

// Get Mongoose to use the global promise library
mongoose.Promise = Promise;

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// c.save((err, createdObject) => {
//   if (err) return handleError(err);
// });

module.exports = {
  connection: db,
  uri: URI
}
