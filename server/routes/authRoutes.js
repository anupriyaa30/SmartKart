const { Router } = require('express');
const { test, login } = require('../controllers/authController');
const checkUser = require('../middleware/checkUser');

const router = Router();

router.get('/test', test);
router.post('/login', login);

module.exports = router;