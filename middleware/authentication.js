const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    // Check for correct Header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Autentication invalid')
    }

    // Extraer el token separando donde hay espacio y tomando el segundo elemento
    const token = authHeader.split(' ')[1]

    // Get the payload con el método verify 
    try {
        const payload = jwt.verify(token, process.env.JWT_TOKEN)
        // attach the user to the job routes
        req.user = { userID: payload.userID, name: payload.name }       //Ver createJWT en models/User
        next()
        
    } catch (error) {
        throw new UnauthenticatedError('Autentication invalid')
    }
};


module.exports = auth