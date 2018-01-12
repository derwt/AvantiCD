const mongoose = require('mongoose');
const URL = 'mongodb://localhost:27017/avantiCD';

//Set up default mongoose connection
var mongoDB = URL;
mongoose.connect(mongoDB, {
  useMongoClient: true
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// c.save((err, createdObject) => {
//   if (err) return handleError(err);
// });

module.exports = {
  url: URL
}
