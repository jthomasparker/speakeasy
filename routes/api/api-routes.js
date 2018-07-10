const router = require('express').Router();
const net = require('../../net/app.js')

// /api/sentiment
router.route('/')
    .post(net.getSentiment)


module.exports = router;