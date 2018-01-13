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
  Customer.find({ phone: req.params.number }, (err, data) => {
    if (err) res.status(404).send(err);

      customer = new Customer({
        cid:     req.body.cid,
        phone:   req.body.phone,
        city:    req.body.city,
        address: req.body.address,
        cross:   req.body.cross,
        note:    req.body.note,
        ordered: req.body.ordered  });

      isNull = (field) => {
          return field == "" || field == null;
      }
      // if (!isNull(req.body.phone)) customer.phone = req.body.phone;
      console.log(customer);
      customer.getPhoneNumbers();
      res.json(customer);
  });

});

module.exports = customersRouter;
