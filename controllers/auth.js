const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {

    const user = await User.create({ ...req.body })

    const token = user.createJWT()      //createJWT es un "instance method" del Schema de User provisto por mongoose

    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
};

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    
    //Handle authentication error
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    //Compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    //Generate Token 
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
};

module.exports = {
    register,
    login
}