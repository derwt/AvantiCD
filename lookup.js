const express = require('express');
const db = require('./config/db');

customersRouter = express.Router();

customersRouter.get('/', (req, res, next) => {
  res.redirect(`/`);
});

// Get a single customer
customersRouter.get('/:phone', (req, res, next) => {

  db.find({phone: req.params.phone}, (err, data) => {
    if (err) return handleError(err);
    if (!data[0]) return;

    console.log(data[0].address);
    data[0].getPhoneNumbers();
  });

  res.redirect('/');
});

module.exports = customersRouter;
