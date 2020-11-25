const mongoose = require('mongoose');

const listItemSchema = mongoose.Schema({
  item_id:String,
  itemName: String,
  itemCostPrice: Number,
  itemSellingPrice: Number,
  item_qty:Number,
  quantity:Number,
  quantity_copy:Number,
  cpCost:Number,
  spCost:Number,
  profit:Number
  })

const orderSchema =  mongoose.Schema({
    billNo:{type:String, required:true},
    clientName: {type:String},
    clientPhoneNo: {type:String, required:true},
    clientAddress:{type:String},
    clientGSTIN:{type:String},
    isInvoiceCreated:{type:Boolean},
    relatedInvoiceId:{type:String},
    amountPaid:{type:Number, required:true},
    totalCost:{type:Number, required:true},
    totalProfit:{type:Number, required:true},
    paymentType:{type:String, required:true},
    lastUpdatedDate:{type:String, required: true},
    purchasedDate:{type:String, required: true},
    businessType:{type:String, required: true},
    businessType_copy:{type:String, required: true},
    transaction:{type:String},
    listOfItems: [listItemSchema],
    creator:{type:mongoose.Schema.Types.ObjectId, ref:"User", required:true}
});

module.exports = mongoose.model('Order', orderSchema);