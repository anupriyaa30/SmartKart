const { Router } = require('express');
const { like, liked, productClicked, rate, search } = require('../controllers/userController');
const { checkUser } = require('../middleware/checkUser');

const router = Router();

router.post('/like', checkUser, like)
router.post('/liked', checkUser, liked)
router.post('/productClicked', checkUser, productClicked)
router.post('/rate', checkUser, rate)
router.get('/search', search)

module.exports = router;