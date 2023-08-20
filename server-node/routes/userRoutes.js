const { Router } = require('express');
const { like, liked, productClicked, rate, search, order, myOrders } = require('../controllers/userController');
const { checkUser } = require('../middleware/checkUser');

const router = Router();

router.post('/like', checkUser, like)
router.post('/liked', checkUser, liked)
router.post('/productClicked', checkUser, productClicked)
router.post('/rate', checkUser, rate)
router.post('/order', checkUser, order)
router.get('/search', search)

module.exports = router;