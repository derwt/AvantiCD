const express = require('express');
const Customer = require('./app/models/customer');

customersRouter = express.Router();

    customersRouter.get('/:number', (req, res, next) => {

      Customer.find({ phone: req.params.number }, (err, customers) => {
        if (err) res.status(404).send(err);

        console.log(customers);
        // res.status(200).send(customers);
      });
    });

module.exports = customersRouter;
