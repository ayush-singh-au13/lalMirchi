const express = require('express');
const router = express.Router();
const prodCtrl = require('./../controller/products.controller');
const { verifyToken } = require('./../../hooks/Auth/index');
const { isValidUser } = require('./../../hooks/others/index')

//@desc add  a Product role-wise
router.post('/addProduct',verifyToken,isValidUser,prodCtrl.addProduct)

// @desc All products list
router.get('/getAllProducts',verifyToken, prodCtrl.getAllProducts)

//@desc add a category role-wise
router.post('/addCategory',verifyToken, isValidUser,prodCtrl.addCategory)

//@desc All category list
router.get('/allCategories',verifyToken, prodCtrl.allCategories)

//@desc product list category-wise
router.get('/products_category_Wise',verifyToken, prodCtrl.products_category_Wise)


module.exports = router;
