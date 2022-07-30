const mongoose = require('mongoose')
const express = require('express')
const router = express.Router();
const orderCtrl = require('./../controller/orders.controller');
const { verifyToken} = require('./../../hooks/Auth/index')
const {isValidUser} = require('./../../hooks/others/index')

/** @Desc adding items to cart */
router.post('/addItemToCart/:userId',verifyToken,orderCtrl.addItemToCart)

/**@Desc list the cart items*/
router.get('/listCartItems',verifyToken, orderCtrl.listCartItems)

/** @Desc update item in cart- delete */
router.delete('/updateItem/:cartId',verifyToken,orderCtrl.updateItem)

/** @Desc order place by a customer */
router.post('/orderPlacing/:cartId',verifyToken, orderCtrl.orderPlacing)

/** @Desc orders list of all users , protected route*/

router.get('/ordersList/allUsers',verifyToken, isValidUser, orderCtrl.ordersList)

/** @Desc approve order by superAdmin and update the total quantity */
router.post('/approveOrder',verifyToken,isValidUser, orderCtrl.approveOrder)


module.exports = router;

