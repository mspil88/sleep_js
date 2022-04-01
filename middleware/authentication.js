const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {UnauthenticatedError} = require("../errors/");


const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    console.log(`autheader: ${authHeader}`)
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      console.log(`payload: ${payload.userId}`)
      // attach the user to the job routes
      req.user = { userId: payload.userId, name: payload.name }
      next()
    } catch (error) {
      throw new UnauthenticatedError('Authentication invalid')
    }
  }

module.exports = auth;