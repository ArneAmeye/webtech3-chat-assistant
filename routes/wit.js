const express = require('express');
const router = express.Router();
const passport = require('../passport/passport')

const witController = require('../controllers/wit');

//POST a message
router.post('/',  passport.authenticate('jwt', {session: false}), witController.post);

module.exports = router;