const express = require('express');
const db = require('./db');

customersRouter = express.Router();

// db.find({'Phone Numbers': 6504008921}, (err, data) => {
//   if (err) return handleError(err);
//     // console.log(data instanceof Array);
//     // console.log(data[0] instanceof Object);
//     // console.log(length(data[0]))
//     console.log(data);
// });

customersRouter.get('/', (req, res, next) => {
  res.redirect(`/`);
});

// Get a single customer
customersRouter.get('/:number', (req, res, next) => {
  console.log("Hello " + req.params.number);
});

module.exports = customersRouter;
