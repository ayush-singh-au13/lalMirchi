const _ = require('lodash')

module.exports = async (req, res, next) => {
    let role = req.user ? req.user.role : "";
    console.log(role)

    if(!_.isEmpty(role) && role !== 'superAdmin') {
        return res.status(403).json({message: 'You do not have permission to access this API !!'})

    }
    next();
}