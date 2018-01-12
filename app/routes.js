const Customer = require('./models/customer');
const path = require('path');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	app.get('/', (req, res, next) => {
    Customer.find((err, customers) => {
      if (err) res.status(404).send(err);

      console.log(customers);
    });
  });

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendFile('./public/index.html', { root: path.join(__dirname, '../') });
	});

};
