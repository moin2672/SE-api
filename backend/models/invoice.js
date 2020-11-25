const mongoose = require('mongoose');

const invoiceSchema =  mongoose.Schema({
    invoiceNo:{type:String, required:true},
    orderId:{type:String},
    orderBillNo:{type:String},
    HSNcode: {type:Number},
    SGST: {type:Number},
    CGST: {type:Number},
    IGST:{type:Number},
    eWayBillNo:{type:Number},
    vehicleNo:{type:String},
    transporterName:{type:String},
    lastUpdatedDate:{type:String},
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Invoice', invoiceSchema);