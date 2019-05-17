var express = require('express');
var router = express.Router();

var messageController = require('../controllers/messages');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChatApp' });
});

/* GET log in page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'ChatApp - Log In' });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'ChatApp - Register' });
});

module.exports = router;
