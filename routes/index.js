var express = require('express');
var router = express.Router();

var messageController = require('../controllers/messages');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChatApp' });
});

//GET messages (ALL or by USER query string)
router.get('/api/v1/messages' , messageController.get);

//GET specific message by ID
router.get('/api/v1/messages/:id', messageController.getId);

//POST a message
router.post('/api/v1/messages', messageController.post);

//PUT (update) a message
router.put('/api/v1/messages/:id', messageController.put);

//DELETE a message by ID
router.delete('/api/v1/messages/:id', messageController.del);


module.exports = router;
