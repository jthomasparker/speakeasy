const router = require('express').Router();
const net = require('../../net/app.js')
const db = require('../../models')
const userController = require('../../controllers/userController')

router.get('/:query?', (req, res) => {
    console.log("publicApi:",req.query)
    let query = req.query.q;
    let userId = req.query.apikey;
    let netName = req.query.netname;
    db.User.findById(userId)
        .then(dbUser => {
                if(netName){
                db.Net.findOne(
                    { 
                        name: netName,
                        _userId: userId
                    }
                )
                    .then(dbNet => {
                        console.log(dbNet)
                        if(dbNet){
                            res.status(404).send("Error: Net not found. Check netname.")
                        } else {
                            req.body.userInput = query
                            req.body.netId = dbNet._id
                            userController.getUserNetResult(req, res)
                        }
                    })
                    .catch(err => {
                        res.status(403).send("Error: Net not found with that name/key combination")
                    })
                } else {
                    req.body.userInput = query
                    net.getSentiment(req, res)
                }
        })
        .catch(err => {
            res.status(403).send("Error: Bad API Key or empty query")
    })


    
})

module.exports = router;