const router = require('express').Router();
const userController = require('../../controllers/userController')


// /braintrain/
router.get('/', (req, res) => {
    if(req.user) {
        res.json({
            userData: req.user,
            urlPath: '/braintrain/' + req.user.user.userId
        })
    } else {
        res.json({
            status: "Not Authorized",
            urlPath: '/login'
        })
    }
})

router.route('/:userId/create')
    .post(userController.createNet)

router.route('/:userId/train')
    .post(userController.trainNet)

router.route('/:userId/result')
    .post(userController.getUserNetResult)


module.exports = router;