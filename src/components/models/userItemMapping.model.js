// cart items for a user account
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userItemMappingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  cartId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      productId:{
        type:String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount_pr: {
        type: Number,
        required: true,
      },
      category:{
        type: String,
        required: true,
      }
    },
  ],
  isOrderPlaced: {
    type: Boolean,
    default: false,
  },
  isDeleted:{
      type: Boolean,
      default: false
  }
},
{timestamps:true})

module.exports = mongoose.model('useritemmapping', userItemMappingSchema)
