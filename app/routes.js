var path = require('path');

module.exports = (app) => {

  app.get('*', (req, res, next) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../public/views') });
});

};
