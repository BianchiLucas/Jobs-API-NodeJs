const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    // Custom Error || Default 
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later'
  }

  // Validation error
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')   // Object.value devuelve array con valores correspondientes a las propiedades del obj
    customError.statusCode = 400
  }

  // Error code 11000 is duplicate value
  if (err.code && err.code === 1100) {
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)}, please choose another value`   // Object.keys devuelve array de propiedades NAME de un objeto
    customError.statusCode = 400
  }

  // Cast error (parámetro)
  if (err.name === 'CastError') {
    customError.msg = `No item found with ID: ${err.value}`
    customError.statusCode = 404
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
