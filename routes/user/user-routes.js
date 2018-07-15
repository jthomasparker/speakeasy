const router = require('express').Router();


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

module.exports = router;