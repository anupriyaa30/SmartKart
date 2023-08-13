const { Router } = require('express');
const { like, liked, productClicked, rate } = require('../controllers/userController');
const { checkUser } = require('../middleware/checkUser');

const router = Router();

router.post('/like', checkUser, like)
router.post('/liked', checkUser, liked)
router.post('/productClicked', checkUser, productClicked)
router.post('/rate', checkUser, rate)

module.exports = router;