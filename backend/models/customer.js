const mongoose = require('mongoose');

const customerSchema =  mongoose.Schema({
    customerName: {type:String, required: true},
    customerPhoneNo: {type:String,  unique:true, required:true},
    customerAddress: {type:String},
    customerEmail: {type:String},
    customerGSTIN: {type:String},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Customer', customerSchema);