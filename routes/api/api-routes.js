const router = require('express').Router();
const net = require('../../net/app.js')
const trainerController = require('../../controllers/trainerController')

// /api/sentiment
router.route('/')
    .post(net.getSentiment)

router.route('/trainer')
    .post(trainerController.updateOrInsert)
    
module.exports = router;