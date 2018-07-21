const router = require('express').Router();
const userController = require('../../controllers/userController')


// /braintrain/
router.get('/', (req, res) => {
    if(req.user) {
        res.json({
            userData: req.user,
            urlPath: '/braintrain/'// + req.user.user.userId
        })
    } else {
        res.json({
            status: "Not Authorized",
            urlPath: '/login'
        })
    }
})

router.route('/create')
    .post(userController.createNet)

router.route('/train')
    .post(userController.trainNet)

router.route('/result')
    .post(userController.getUserNetResult)

router.route('/load')
    .get(userController.getAllUserNets)


module.exports = router;