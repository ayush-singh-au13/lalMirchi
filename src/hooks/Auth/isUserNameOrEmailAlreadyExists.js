
const mongoose = require('mongoose');
const userModel = require('./../../components/models/user.model');
const _ = require('lodash');

module.exports = async (req,res,next) => {
    const {username, email} = req.body;
    const isUserNameExists = await userModel.findOne({username:username}).lean();

    if(!_.isEmpty(isUserNameExists)){
        return res.status(409).json({message:'User Already Exists, Please try with a different username!!'})

    }
    const isEmailExists = await userModel.findOne({email:email}).lean();
    if(!_.isEmpty(isEmailExists)){
        return res.status(409).json({message:'User Already Exists, Please try with a different email!!'});
    }
    next();
}