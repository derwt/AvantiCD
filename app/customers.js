const express = require('express');
const Customer = require('./models/customer');

customersRouter = express.Router();

customersRouter.get('/', (req, res, next) => {
  Customer.find((err, customers) => {
    if (err) res.status(404).send(err);

    res.json(customers);
  });
});

customersRouter.get('/:number', (req, res, next) => {
  Customer.find({ phone: req.params.number }, (err, customers) => {
    if (err) res.status(404).send(err);

    res.json(customers);
  });
});

customersRouter.post('/', (req, res) => {

  let customer = new Customer();
  customer.cid = req.body.cid;
  customer.phone = req.body.phone;
  customer.city = req.body.city;
  customer.address = req.body.address;
  customer.cross = req.body.cross;
  customer.note = req.body.note;
  customer.ordered = req.body.ordered;

  customer.save((err) => {
    if (err) res.status(404).send(err);

    res.json(customer);
  });

});

customersRouter.put('/:number', (req, res, next) => {
  Customer.findOne({ phone: req.params.number }, (err, customer) => {
    if (err) res.status(404).send(err);

    // Do not update a field when its matching input is empty ('')
    isEmpty = (field) => { return req.body[field] == '' || req.body[field] == null || req.body[field] == undefined; }
    defaultField = (field) => {
      if (isEmpty(field)) return customer[field];
      else return req.body[field];
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

// Only call this after finding the correct customer through UI
customersRouter.delete('/:cid', (req, res, next) => {
  Customer.remove({ cid: req.params.cid }, (err, customer) => {
    if (err) res.status(400).send(err);

    res.json({ message: 'DELETE SUCCESS @ CID: ' + req.params.cid });
  });
});

module.exports = customersRouter;
