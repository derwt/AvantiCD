const URL = 'mongodb://localhost:27017/avantiCD';

//Import the mongoose module
const mongoose = require('mongoose');

// Define a schema
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  cid:     Number,
  phone:  [Number],
  city:    String,
  address: String,
  cross:   String,
  note:    String,
  ordered: Number
}, {collection: 'Customers4'});

// customerSchema.methods.getCID =             function() { return this.cid; };
customerSchema.methods.getPhoneNumbers =     function() { for (var i = 0; i < this.phone.length; i++) { console.log(this.phone[i]); } };
// customerSchema.methods.getCity =            function() { return this.city; };
// customerSchema.methods.getCrossStreet =     function() { return this.cross; };
// customerSchema.methods.getNote =            function() { return this.note; };
// customerSchema.methods.getTimeLastOrdered = function() { return this.ordered; };
// customerSchema.methods.getAddress =         function() { return this.address; };

//Set up default mongoose connection
var mongoDB = URL;
mongoose.connect(mongoDB, {
  useMongoClient: true
});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

// Customer = mongoose.model('Customer', customerSchema);
// var c = new Customer({ cid: 9997, phone: [10, 20], city: "BM", address: "2700 Yo Dr.", cross: "Cross St", note: "Note to self!", ordered: 999999});

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// c.save((err, createdObject) => {
//   if (err) return handleError(err);
// });

module.exports = mongoose.model('Customer', customerSchema);
