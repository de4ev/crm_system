const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys')

const User = require('../models/User')

module.exports.login = async function(req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate) {
        // user  exists
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if (passwordResult) {
            // token
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 3600})

            res.status(200).json({
                token: `Bearer ${token}`
            })
        } else {
            // wrong password
            res.status(401).json({
                message: 'Wrong password.'
            })
        }
    } else {
        // error
        res.status(404).json({
            message: 'User not found.'
        })
    }
}

module.exports.register = async function(req, res) {
    
    const candidate = await User.findOne({email: req.body.email})

    if (candidate) {
        // email already exists, error
        res.status(409).json({
            message: 'This email address is already registered'
        })
    } else {
        // create new user
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save()
            res.status(201).json(user)
        } catch(e) {
            // handle error
        }
         
    }
}