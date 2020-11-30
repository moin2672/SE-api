const mongoose = require('mongoose');

const itemSchema =  mongoose.Schema({
    itemName: {type:String, unique:true, required: true},
    itemSellingPrice: {type:Number, required:true},
    itemCostPrice: {type:Number},
    itemQuantity: {type:Number},
    itemHSN:{type:String},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Item', itemSchema);