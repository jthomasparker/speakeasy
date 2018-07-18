const db = require('../models')
const AsyncClassifier = require('../async-classifier/async-classifier.js')

module.exports = {
    createNet: (req, res) => {
        db.Net
            .create({
                _userId: req.user.user.userId,
                name: req.body.netName
            })
            .then(dbNet => res.json(dbNet))
            .catch(err => res.status(422).json(err))
    },
    trainNet: (req, res) => {
        const trainingData = req.body.trainingData
        let userNet = new AsyncClassifier()
        db.Net
            .findById(req.body.netId)
            .then(dbNet => {
                if(dbNet.netData){
                    userNet.restore(dbNet.netData)
                }
                trainingData.map(datum => {
                    userNet.addDefinition(datum.input, datum.output)
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
        let userInput = req.userInput
        db.Net.findById(netId)
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