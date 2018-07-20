const db = require('../models')
const AsyncClassifier = require('../async-classifier/async-classifier.js')

module.exports = {
    createNet: (req, res) => {
        console.log(req.body, req.user.user.userId)
        db.Net
            .create({
                _userId: req.user.user.userId,
                name: req.body.netName
            })
            .then(dbNet => {
                db.User
                    .findByIdAndUpdate(dbNet._userId,
                    { $push: { nets: dbNet._id }})
                    .then(dbUser => {
                        res.json({
                            userId: dbUser._id,
                            userName: dbUser.username,
                            netId: dbNet._id,
                            netName: dbNet.name
                        })
                    })
                
            })
            .catch(err => res.status(422).json(err))
    },
    trainNet: (req, res) => {
        console.log(req.body)
        const trainingData = req.body.trainingData
        let userNet = new AsyncClassifier()
        db.Net
            .findById(req.body.netId)
            .then(dbNet => {
                if(dbNet.netData){
                    userNet.restore(dbNet.netData)
                }
                trainingData.map(dataObj => {
                    userNet.addDefinition(dataObj.input, dataObj.output)
                })
                userNet.train()
                    .then(trainingRes => {
                        let userNetJson = userNet.save()
                        db.Net
                            .findByIdAndUpdate(dbNet._id, 
                            { $set: { netData: userNetJson }},
                            (err, result) => {
                                console.log(result)
                                if(err) {
                                    res.json({
                                        status: "Error saving net",
                                        error: err
                                    })
                                }
                                res.json({
                                    status: "Net trained and saved",
                                    trainingRes: trainingRes
                                })
                            })
                    })
                    .catch(trainingRes => {
                        res.json({
                            status: "Error training net",
                            trainingRes: trainingRes
                        })
                    })
            })
            .catch(err => res.json({error: err}))
    },
    getUserNetResult: (req, res) => {
        console.log(req.body)
        let userInput = req.body.userInput
        db.Net.findById(req.body.netId)
            .then(dbNet => {
                let userNet = new AsyncClassifier()
                userNet.restore(dbNet.netData)
                let results = userNet.getResult(userInput)
                let topResult = userNet.getTopResult(userInput)
                res.json({
                    topResult: topResult,
                    allResults: results
                })
            })
            .catch(err => {
                res.json({
                    status: "Error loading net",
                    error: err
                })
            })

    },
    // probably don't need
    saveNet: (req, res) => {
        db.Net
        .findOneAndUpdate(
            {
                _id: req.body.netId
            },
            req.body,
            {
                upsert: true, 
                new: true, 
                runValidators: true
            },
            (err, result) => {
                if(err) throw err
                res.json(result)
            }
        )
    },

    getAllUserNets: (req, res) => {
        db.User
            .findOne({ _id: req.userId })

            //commented out - probably don't want to 'populate' since we just need id/name
        /*    .populate('nets')
            .exec((err, user) => {
                if(err){
                    res.json({
                        status: "Error loading user nets",
                        error: err
                    })
                }
                res.json({
                    netId: user.nets
                })
            }) */
    }
}