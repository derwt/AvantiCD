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

    console.log(customers);
  });
});

customersRouter.post('/', (req, res) => {

  var customer = new Customer();
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
  Customer.findOne({ phone: req.params.number }, (err, data) => {
    if (err) res.status(404).send(err);

    isEmpty = (field) => { return req.body[field] == '' || req.body[field] == null || req.body[field] == undefined; }
    defaultField = (field) => {
      if (isEmpty(field)) return data[field];
      else return req.body[field];
    }

      customer = new Customer({
        cid:     data.cid,
        phone:   defaultField('phone'),
        city:    defaultField('city'),
        address: defaultField('address'),
        cross:   defaultField('cross'),
        note:    defaultField('note'),
        ordered: defaultField('ordered')
      });

      customer.validate((err) => {
        if (err) console.log('SAVE UNSUCCESSFUL: ' + err.message);
        else {
          customer.save();
        }
      });
      res.json(customer);
  });

});

module.exports = customersRouter;
