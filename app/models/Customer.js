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
}, {collection: 'Customers'});

// Define Customer methods
customerSchema.methods.getPhoneNumbers = function() { for (var i = 0; i < this.phone.length; i++) { console.log(this.phone[i]); } }

// Customer = mongoose.model('Customer', customerSchema);
// var c = new Customer({ cid: 9997, phone: [10, 20], city: "BM", address: "2700 Yo Dr.", cross: "Cross St", note: "Note to self!", ordered: 999999});

module.exports = mongoose.model('Customer', customerSchema);
