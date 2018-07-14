const router = require('express').Router();
const authController = require('../../controllers/authController')


// /auth/ routes
router.route('/login')
    .post(authController.login)

router.route('/signup')
    .post(authController.create)

router.post('/test', (req, res) => {
    console.log(req.body)
    res.json(req.body)
})

module.exports = router;