require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        mazlength: 30,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6
    }
});

//Generate a salt (random strign) and hashing the password:
// Funcion escrita de forma clásica y no arrowfunction para acceder al documento usando "this"
//Pre es un middleware, funciona con async/await y no requiere next()
UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
});

//Generate the Token using Instance method provided by mongoose
UserSchema.methods.createJWT = function () {
    return jwt.sign({ userID: this._id, name: this.name }, process.env.JWT_TOKEN, { expiresIn: process.env.JWT_LIFETIME })
}

//Compare passwords whit compare method provided by bcrypt
UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', UserSchema)