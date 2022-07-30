const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    orderId:{
        type:Number
    },
    orderedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userEmail:{
        type:String,
        required: true
    },
    products:[{
        productName:{
            type:String,
            required:true
        },
        qty:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        discount_pr:{
            type:Number,
            required:true
        }
      
    }],
    totalPrice:{
        type:Number
    },
   dateOfOrder:{
       type:Date
   },
   isDeleted:{
    type:Boolean,
    default:false
   },
   // super admin will approve once order is place from user
   isOrderApproved:{
       type:Boolean
   }

},{
    timestamps: true
})

module.exports = mongoose.model('order',OrderSchema);