const { Router } = require('express');
const { like, liked, productClicked } = require('../controllers/userController');
const { checkUser } = require('../middleware/checkUser');

const router = Router();

router.post('/like', checkUser, like)
router.post('/liked', checkUser, liked)
router.post('/productClicked', checkUser, productClicked)

module.exports = router;