const express = require('express');
const Customer = require('./models/customer');

customersRouter = express.Router();

    customersRouter.get('/:number', (req, res, next) => {
      Customer.find({ phone: req.params.number }, (err, customers) => {
        if (err) res.status(404).send(err);

        console.log(customers);
      });
    });

module.exports = customersRouter;
