// MODEL
const express = require('express');
const Customer = require('./models/customer');

customersRouter = express.Router();

// CREATE
customersRouter.post('/', (req, res) => {

  let customer = new Customer();

  // Find largest CID and assign +1 to new customer
  Customer.find().sort({cid: -1}).limit(1).cursor()
  .on('data', (doc)=> {
    customer.cid = doc.cid + 1;
    customer.phone = req.body.phone;
    customer.city = req.body.city;
    customer.address = req.body.address;
    customer.cross = req.body.cross;
    customer.note = req.body.note;
    customer.ordered = 1222222222;//req.body.ordered;

    customer.validate((err) => {
      if (err) console.log('SAVE UNSUCCESSFUL: ' + err.message);
      else {
        customer.save((err) => {
          if (err) res.status(400).send(err);
          else {
            res.json(customer);
          }
        });
      }
    });
  });


});

// READ
customersRouter.get('/:number', (req, res, next) => {
  Customer.find({ phone: req.params.number }, (err, customers) => {
    if (err) res.status(404).send(err);
    console.log('Getting by Phone Number: ' + req.params.number);
    res.json(customers);
  });
});

customersRouter.get('/', (req, res, next) => {
  Customer.find((err, customers) => {
    if (err) res.status(404).send(err);
    console.log('Getting All Customers');
    console.log(req.params);
    res.json(customers);
  });
});

// UPDATE
customersRouter.put('/:number', (req, res, next) => {
  Customer.findOne({ phone: req.params.number }, (err, customer) => {
    if (err) res.status(404).send(err);
    if (customer == undefined) {
        console.log('GET FAILED: Customer with phone #' + req.params.number + ' could not be found');
        res.redirect('/');
        return;
    }

    // Do not update a field when its matching input is empty ('')
    isEmpty = (field) => { return req.params[field] == '' || req.params[field] == null || req.body[field] == undefined; }
    defaultField = (field) => {
      if (isEmpty(field)) return customer[field];
      else return req.params[field];
    }

      console.log("Updating customer with CID: " + customer.cid);
      customer.phone   = defaultField('phone');
      customer.city    = defaultField('city');
      customer.address = defaultField('address');
      customer.cross   = defaultField('cross');
      customer.note    = defaultField('note');
      customer.ordered = defaultField('ordered')

      customer.validate((err) => {
        if (err) console.log('SAVE UNSUCCESSFUL: ' + err.message);
        else {
          customer.save();
        }
      });

      res.json(customer);
  });

});

// DELETE: Only call this after finding the correct customer through UI
customersRouter.delete('/:cid', (req, res, next) => {
  Customer.remove({ cid: req.params.cid }, (err, customer) => {
    if (err) res.status(400).send(err);

    res.json({ message: 'DELETE SUCCESS @ CID: ' + req.params.cid });
  });
});

module.exports = customersRouter;
