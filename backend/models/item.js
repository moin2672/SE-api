const mongoose = require('mongoose');

const itemSchema =  mongoose.Schema({
    itemName: {type:String, unique:true, required: true},
    itemSellingPrice: {type:Number, required:true},
    itemCostPrice: {type:Number},
    itemQuantity: {type:Number},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Item', itemSchema);