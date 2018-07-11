const db = require('../models')

module.exports = {
    findAll: (req, res) => {
        db.Trainer
        .find(req.query)
        .sort({ date: -1 })
        .then(dbTrainer => res.json(dbTrainer))
        .catch(err => res.status(422).json(err))
    },

    create: (req, res) => {
        db.Trainer
        .create(req.body)
        .then(dbTrainer => res.json(dbTrainer))
        .catch(err => res.status(422).json(err))
    },

    updateOrInsert: (req, res) => {
        db.Trainer
        .findOneAndUpdate(
            {
                input: req.body.input
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

    remove: (req, res) => {
        console.log(req.params.id)
        db.Trainer
        .findById({ _id: req.params.id })
        .then(dbTrainer => dbTrainer.remove())
        .then(dbTrainer => res.json(dbTrainer))
        .catch(err => res.status(422).json(err))
    }
}