const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    categoryName:{
        type:String,
        required: true,
    },
    createdBy:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default:0
    }
},{timestamps:true});

module.exports = mongoose.model('category',CategorySchema)