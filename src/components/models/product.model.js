const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    productId:{
        type:Number,
        required:true
    },
    title: {
        type:String,
        required:true,
        trim: true,
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:0
    },
    thumbnail:{
        type:String
    },
    images:{
        type:Array,
        required:true
    },
    discountPercentage:{
        type:Number,
        default:0
    },
    isDeleted:{
        type:Boolean,
        default:0        //0-available, 1- soft delete
    },
    isAvailable:{
        type:Boolean,
        default:1       // 1- product is in stock, 0- out of stock
    }
},
{
    timestamps: true
}
);
ProductSchema.index({
    productId:1,
    rating:1
})


module.exports = mongoose.model('product',ProductSchema);