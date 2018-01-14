//Import the mongoose module
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define a schema
var Schema = mongoose.Schema;

var customerSchema = new Schema({
  cid: {
    type: Number,
    min: [1000, 'CID must be > 1000'],
    required: [true, 'CID required'],
    unique: [true, 'Customer with CID {VALUE} exists']
  },
  phone:  {
    type: [Number],
    validate: {
      validator: (numbers) => {
        for (let value of numbers) {
          if (!(/^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/).test(value)) return false; // Phone number regex
        }
        return true;
      },
      message: '{VALUE} is not a valid phone number!',
    },
    required: [true, 'User phone number required']
  },
  city: {
    type: String,
    required: [true, 'Customer city required']
  },
  address: String,
  cross:   String,
  note:    String,
  ordered: Number
}, {collection: 'Customers'});

customerSchema.plugin(uniqueValidator);

// Define Customer methods
customerSchema.methods.getPhoneNumbers = function() { for (var i = 0; i < this.phone.length; i++) { console.log(this.phone[i]); } }
customerSchema.methods.fieldIsEmpty = function(field) { return field == "" || field == null; }

// Customer = mongoose.model('Customer', customerSchema);
// var c = new Customer({ cid: 9997, phone: [10, 20], city: "BM", address: "2700 Yo Dr.", cross: "Cross St", note: "Note to self!", ordered: 999999});

module.exports = mongoose.model('Customer', customerSchema);
