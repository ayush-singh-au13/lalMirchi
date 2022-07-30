const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user.controller');
const {isUserNameOrEmailAlreadyExists,isValidPassword,verifyToken} = require('../../hooks/Auth/index')


//@SignUp User

router.post('/signup',isUserNameOrEmailAlreadyExists,userCtrl.createUser);

//@Login Users
router.post('/login',isValidPassword, userCtrl.login)

//@User details
router.get('/getUserDetails',verifyToken, userCtrl.getUserDetails)
module.exports = router;