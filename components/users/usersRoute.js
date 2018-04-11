const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const userDAO = require('./userDAO');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('user', { username: userDAO.getUsername() });
});

module.exports = router;
