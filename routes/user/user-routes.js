const router = require('express').Router();
const authController = require('../../controllers/authController')

router.get('/', (req, res, next) => {
    console.log("made it")
    if(req.user) {
        next()
    } else {
        res.redirect('/login')
    }
})

module.exports = router;