const db = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtExp = require('express-jwt')

module.exports = {
    create: (req, res) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                res.json({
                  status: 'Unable to create username with password provided',
                  error: err
                })
            } else {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    db.User.create({
                        username: req.body.username,
                        password: hash
                    })
                    .then(user => {
                        res.json({
                            username: user.username,
                            userId: user._id
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: 'Error creating user',
                            error: err
                        })
                    })
                })
            }
        })
    },

    login: (req, res) => {
        console.log(req.body)
        db.User.findOne({ username: req.body.username })
            .then(user => {
                console.log(user)
                if(user){
                    bcrypt.compare(req.body.password, user.password, (err, valid) => {
                        if(err || !valid){
                            res.json({
                                status: 'Incorrect username or password',
                                error: err
                            })
                        } else {
                            let jwtAuthToken = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                user: {
                                    userId: user._id,
                                    username: user.username
                                }
                            }, 'random_secret')
                            res.cookie('jwtAuthToken', jwtAuthToken, {
                                secure: process.env.NODE_ENV === 'development',
                                signed: true
                            })
                            res.json({
                                username: user.username,
                                userId: user._id
                            })
                        }
                    })
                } else {
                    res.json({
                        status: 'Username not found'
                    })
                }
            })
    }
}
