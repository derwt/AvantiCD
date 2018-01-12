const express = require('express');
const Customer = require('./models/customer');

customersRouter = express.Router();

    app.get('/', (req, res, next) => {
      Customer.find((err, customers) => {
        if (err) res.status(404).send(err);

        res.json(customers);
      });
    });

module.exports = customersRouter;
