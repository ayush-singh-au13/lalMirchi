const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Counter = new Schema({
    _id:{
        type: String,
        required: true,
    },
    seq:{
        type:Number,
        required:true
    }
});

Counter.index({
    seq:1
});

const counter = mongoose.model('counter',Counter);


    
    const auto_increment = async (userId) => {
        let result = await counter.findOneAndUpdate({_id: userId}, {$inc:{seq:1}},{upsert:true,returnOriginal:false}); 
        return result;
        }
    

module.exports = {
    counter,
    auto_increment
};

