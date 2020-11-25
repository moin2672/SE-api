const mongoose = require('mongoose');

const shopSchema =  mongoose.Schema({
    shopName: {type:String, required: true},
    shopPhoneNo: {type:String,  unique:true, required:true},
    shopAddress: {type:String},
    shopEmail: {type:String},
    shopGSTIN: {type:String},
    shopConditions: {type:String},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Shop', shopSchema);