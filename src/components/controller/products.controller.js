const express = require('express');
const mongoose = require('mongoose');
const productModel = require('./../models/product.model');
const categoryModel = require('./../models/category.model');
const _ = require('lodash');


class Products {
    constructor(){
    }
    // get all products
    getAllProducts = async (req, res) => {
        try {
            let limit = !(req.query.limit) ? 10 : req.query.limit;
            let page = !(req.query.page)? 1: req.query.page;
            let skipDocs = parseInt(page - 1)*limit,
            sortBy = req.query.sort || 'productId',
            sortArray = {};
            sortArray[sortBy] = 1;

            let search = req.query.search || '';
            let projection = {};

            if(search !== ""){
                skipDocs=0,
                    // page=0,
                projection = {
                    
                    $or:[
                    {title:{$regex:search,$options:'i'}},{category:{$regex:search,$options:'i'}}]
                
                }
            }
            let totalProducts = await productModel.countDocuments({...projection});
            let allProducts = await productModel.find({...projection}).lean().sort({...sortArray}).limit(limit).skip(skipDocs);
            let pageMeta = {
                total:totalProducts,
                skip:skipDocs,
                pageSize:Math.ceil(totalProducts/Number(limit))
            }
            if(!_.isEmpty(allProducts)) {
                return res.status(200).json({message:'Product List !!', product: allProducts,pageMeta})
            }else {
                return res.status(400).json({message:'Unable to fetch Product List !!',product:allProducts,pageMeta})
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({message:"Internal Server Error !!"})
        }
    }
    //add a product
    addProduct = async (req, res) => {
        try {
            let {title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images} = req.body;
            let counter = await productModel.countDocuments();
            let isAvailable = (stock>0) ? true : false;
                
            let dataToUpdate = {
                title: title,
                description:description,
                price: price,
                discountPercentage: discountPercentage,
                rating:rating,
                stock:stock,
                brand:brand,
                category:category,
                thumbnail:thumbnail,
                images:images,
                productId:counter+1,
                isAvailable:isAvailable
            }
           
            let isCreated = await productModel.create({...dataToUpdate});
    
            if(!_.isEmpty(isCreated)){
                return res.status(200).json({message:'Product Added successfully!', data: isCreated});
            }else{
                return res.status(409).json({message:'Product Not Added !'});
    
            }
        }catch(err){
            console.log(err);
            return res.status(500).json({message:'Internal Server Error !'});
    
        }
    }

    //add a category
    addCategory = async (req, res) => {
        try {
        let email = req.user ? req.user.email : "";

        let dataToUpdate = {
            createdBy: email,
            categoryName: req.body.categoryName
        }
        if(!dataToUpdate.categoryName){
            return res.status(400).json({message:'categoryName field is required!'});

        }
        let isCreated = await categoryModel.create({...dataToUpdate});

        if(!_.isEmpty(isCreated)){
            return res.status(200).json({message:'Category Added successfully!', data: isCreated});
        }else{
            return res.status(409).json({message:'Category Not Added !'});

        }
    }catch(err){
        console.log(err);
        return res.status(500).json({message:'Internal Server Error !'});

    }
    }

    //category list
    allCategories = async (req, res) => {
        try {
            let limit = !(req.query.limit) ? 10 : req.query.limit;
            let page = !(req.query.page)? 1: req.query.page;
            let skipDocs = parseInt(page - 1)*limit,
            sortBy = req.query.sort || 'createdAt',
            sortArray = {};
            sortArray[sortBy] = -1;

            let projection = {isDeleted: false,}

            let totalCategories = await categoryModel.countDocuments(projection);
            let allCategories = await categoryModel.find(projection).select('categoryName _id createdBy').lean().sort({...sortArray}).limit(limit).skip(skipDocs);
            let pageMeta = {
                total: totalCategories,
                skip:skipDocs,
                pageSize: Math.ceil(totalCategories/parseInt(limit))
            }
            if(!_.isEmpty(allCategories)){
            return res.status(200).json({message:'Category List !!', category: allCategories,pageMeta})
            }else{
                return res.status(400).json({message:'Unable to fetch Category List !!',category:allCategories,pageMeta})

            }

        }catch (err) {
            console.log(err);
             return res.status(500).json({message:'Internal Server Error !'});

        }
    }

    //product list by categoryName
    products_category_Wise = async (req, res) => {
        try {
        let category = req.query.category || '';
        let limit = !(req.query.limit) ? 10 : req.query.limit;
            let page = !(req.query.page)? 1: req.query.page;
            let skipDocs = parseInt(page - 1)*limit,
            sortBy = req.query.sort || 'productId',
            sortArray = {};
            sortArray[sortBy] = -1;

            let search = req.query.search || '',
            projection = {category: category};
            if(search !== ''){
                skip=0,
                projection={
                    ...projection,
                    title:{$regex:search,$options:'i'}   
                }
         }
            if(_.isEmpty(category)){
                return res.status(409).json({message:'category field is required to be passed as a query params !!'})

            }
            let totalProducts = await productModel.countDocuments({...projection});

            let products = await productModel.find({...projection}).lean().sort({...sortArray}).limit(limit).skip(skipDocs);

            let pageMeta={
                total:totalProducts,
                skip:skipDocs,
                page: Math.ceil(totalProducts/Number(limit))
            }

            if(!_.isEmpty(products)){
                return res.status(200).json({message:'Product List Category-wise!!', products: products,pageMeta})
                }else{
                    return res.status(400).json({message:'Unable to fetch product List !!',products:products,pageMeta})
    
                }

            }catch (err) {
                console.error(err);
                return res.status(500).json({message:'Internal Server Error !'});
            }
        
        
    }
}

module.exports = new Products();