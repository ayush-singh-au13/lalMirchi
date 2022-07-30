const userModel = require('./../../components/models/user.model');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

module.exports = async (req, res, next) => {
    const user = await userModel.findOne({username:req.body.username}).lean();

    if(_.isEmpty(user)) {
        return res.status(404).json({message:'User does not exist, please register !!!'})

    }
    req.user = {...user};
    const validPassword = bcrypt.compareSync(req.body.password,user.password)
    if(!validPassword) {
        return res.status(401).json({message:'Invalid Password !!'})
    }
    next();
}