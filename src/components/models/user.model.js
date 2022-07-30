const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim:true,
        minlength:3
    },
    email:{
        type:String,
        required: true,
        trim:true,
    },
    profilePic:{
        type: String
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        default:'user',
        enum:['user','superAdmin']
    },
    token:{
        type:String
    },
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          
        },
        coordinates: {
          type: [Number],
        
        }
      }

}, 
{timestamps: true}
);


module.exports = mongoose.model('User',userSchema);