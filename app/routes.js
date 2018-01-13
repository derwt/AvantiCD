const Customer = require('./models/customer');
const path = require('path');
const customersRouter = require('./customers');

module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls

  // authentication routes
  app.use('/customers', customersRouter);

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendFile('./public/index.html', {
      root: path.join(__dirname, '../')
    });
  });

};
