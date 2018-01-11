const express = require('express');
const db = require('./db');

customersRouter = express.Router();

customersRouter.get('/', (req, res, next) => {
  res.redirect(`/`);
});

// Get a single customer
customersRouter.get('/:number', (req, res, next) => {
  
  db.find({phone: req.params.number}, (err, data) => {
    if (err) return handleError(err);
    if (!data[0]) return;

    console.log(data[0].address);
    data[0].getPhoneNumbers();
  });

  res.redirect('/');
});

module.exports = customersRouter;
