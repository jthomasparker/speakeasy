const db = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtExp = require('express-jwt')

module.exports = {
    create: (req, res) => {
      //  console.log(req.body)
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
                      //  console.log(result)
                      //  res.redirect('/auth/login')
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
                            res.status(403).json({
                                status: 'Incorrect username or password',
                                error: err
                            })
                        } else {
                            let jwtAuthToken = jwt.sign({
                                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                                data: {
                                    userId: user._id,
                                    username: user.username
                                }
                            }, 'random_secret')
                            res.cookie('jwtAuthToken', jwtAuthToken, {
                                secure: process.env.NODE_ENV === 'production',
                                signed: true
                            })
                          //  res.redirect('/braintrain/' + user._id)

                            res.json({
                                username: user.username,
                                userId: user._id
                            })
                        }
                    })
                }
            })
    },

    authenticate: (req, res) => {
        console.log("made it to auth")
        jwtExp({
            secret: 'random_secret',
            getToken: function fromCookie(req){
                if(req.signedCookies){
                    return req.signedCookies.jwtAuthToken
                }
                return null
            },
            credentialsRequired: false
        })
    }
}
