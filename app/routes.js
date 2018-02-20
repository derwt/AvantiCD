const path = require('path');
const Customer = require('./models/customer');
const customersRouter = require('./customers');

module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls

  // authentication routes
  app.use('/customers', customersRouter);

  // frontend routes =========================================================

  app.get('/views/:name', (req, res, next) =>{
    res.render('views/' + req.params.name);
  });

  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.render('index.pug', {
      root: path.join(__dirname, '../')
    });
  });

};
