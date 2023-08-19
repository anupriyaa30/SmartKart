const { Router } = require('express');
const { test, login, checkLogin, logout } = require('../controllers/authController');
const checkUser = require('../middleware/checkUser');

const router = Router();

router.post('/test', test);
router.post('/login', login);
router.get('/checkLogin', checkLogin);
router.get('/logout', logout);

module.exports = router;