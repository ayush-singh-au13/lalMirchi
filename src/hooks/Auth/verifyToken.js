const userModel = require('./../../components/models/user.model');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    
    if(req.headers['x-access-token'] === undefined) {
        return res.status(403).json({message:'Token is required !!!'});
    }
    const token = req.headers['x-access-token'];
    if(token) {
        let userToken = await userModel.find({token:token})
        if(_.isEmpty(userToken)) {
            return res.status(401).json({message:'Unauthorized User !!'})
        }
    }

    if(!token) {
        return res.status(403).json({message:'Token is required !!!'});
    }
   jwt.verify(token,process.env.SECRET,(err, data)=>{
        if(err){
            return res.status(401).json({message:'Unauthorized User !!'})
        }
        req.user = data;

        next();
    })
}