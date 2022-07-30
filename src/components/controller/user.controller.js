const mongoose = require('mongoose')
const userModel = require('./../models/user.model')
const messageTypes = require('../../responses')
const _ = require('lodash')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'});

class Users {
  constructor() {
    this.message = messageTypes.user
  }

  createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body
      var salt = bcrypt.genSaltSync(parseInt(process.env.SALT))
      var hashPassword = bcrypt.hashSync(password, salt)

      let newUser = await userModel.create({
        username: username,
        email: email,
        role: req.body.role,
        profilePic: req.body.profilePic ? req.body.profilePic : '',
        password: hashPassword,
      })
      if (newUser) {
        return res
          .status(200)
          .json({
            message: this.message.userCreatedSuccessfully,
            data: newUser,
          })
      } else {
        return res.status(409).json({ message: 'User not created!!' })
      }
    } catch (err) {
      return res.status(500).json({ message: 'Internal Server Error!!' })
    }
  }
  login = async (req, res) => {
      try {
      const payload = {
          _id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role
      }
      const token = jwt.sign(payload,process.env.SECRET,{expiresIn:86400});
      payload['token'] = token;
      // console.log("===>")
      if(token) {
        await userModel.updateOne({username:payload.username},{$set:{token:token}})
        
        return res.status(200).json({message: this.message.userLoggedInSuccessfully,data:payload})
      }
    }catch(err){
        return res.status(500).send({message:"Internal Server error !!"})
    }
  }
  getUserDetails = async (req, res) => {
    try {
    let userDetails = {...req.user}
    if(!_.isEmpty(userDetails)){
      return res.status(200).json({message:this.message.userDetailsFetchedSuccessfully, data: userDetails})
    }else{
      return res.status(409).json({message:this.message.userDetailsNotFound})
    }
  }catch(err){
    return res.status(500).send(err)
  }
}
}

module.exports = new Users()
