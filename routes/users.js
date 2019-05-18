var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authController.getSkills);
router.post('/profile/:skill', authController.saveSkill);
router.delete('/profile/:skill', authController.deleteSkill);

module.exports = router;