var express = require('express');
var router = express.Router();
const passport = require('../passport/passport')

var messageController = require('../controllers/messages');

//GET messages (ALL or by USER query string)
router.get('/' , messageController.get);

//GET specific message by ID
router.get('/:id', passport.authenticate('jwt', {session: false}), messageController.getId);

//POST a message
router.post('/',  passport.authenticate('jwt', {session: false}), messageController.post);

//PUT (update) a message
router.put('/:id',  passport.authenticate('jwt', {session: false}), messageController.put);

//DELETE a message by ID
router.delete('/:id',  passport.authenticate('jwt', {session: false}), messageController.del);


module.exports = router;