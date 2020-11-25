const Order = require('../models/order');

var ordersCount=0;


exports.getOrders = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const orderQuery=Order.find().sort({lastUpdatedDate:-1});
    let fetchedOrders;
    if(pageSize && currentPage){
        orderQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    orderQuery
        .then(orders=>{
            fetchedOrders=orders;
            return Order.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Orders fetched successfully", 
                orders:fetchedOrders,
                maxOrders:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get orders")
            res.status(500).json({message:'Failed to fetch Orders!'})
        });
}

exports.searchOrder = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
    const searchType=req.query.searchtype;
console.log(req.query);
console.log(searchText)
        console.log(searchType)
    let orderQuery=Order.find().sort({lastUpdatedDate:-1});
    let fetchedOrders;
    
    
    if(searchText || searchType){
        console.log("inside")
        console.log(searchText)
        console.log(searchType)
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
        if(searchType==""){
            orderQuery=Order.find({$and:[{$or:[{'businessType':'Buy'},{'businessType':'Sell'}]},{$or:[{'billNo':CheckValue},{'clientName':CheckValue},{'clientPhoneNo': CheckValue},{'listOfItems.itemName':CheckValue}]}]}).sort({lastUpdatedDate:-1});    
        }else{
        orderQuery=Order.find({$and:[{'businessType':searchType},{$or:[{'billNo':CheckValue},{'clientName':CheckValue},{'clientPhoneNo': CheckValue},{'listOfItems.itemName':CheckValue}]}]}).sort({lastUpdatedDate:-1});
        }
       
       
        //.find({$or:[{'metadata.userName': CheckValue},{'metadata.originalname': CheckValue},{'clientPhoneNo': CheckValue}]}).sort({uploadDate:-1}).toArray(function(err, files){});
    }

    orderQuery
    .then(orders=>{
        ordersCount=orders.length;
        console.log("orders - Count")
        console.log(ordersCount)
        if(pageSize && currentPage){
            orderQuery
                .skip(pageSize*(currentPage-1))
                .limit(pageSize)
        }
        orderQuery
            .then(orders=>{
                fetchedOrders=orders;
                console.log(orders)
                console.log(orders.length)
                console.log(fetchedOrders.length)
                // if(searchText=="" && searchType==""){
                //     ordersCount=Order.count();
                // }
                // else{
                //     ordersCount=orders.length;
                // }
                // return Order.count();
            })
            .then(count=>{
                // console.log("count")
                // console.log(count)
                if((searchText!="" || searchType!="") && (typeof(searchText)!="undefined" || typeof(searchType)!="undefined")){
                    count= fetchedOrders.length;
                    // console.log(count)
                }
                console.log(count)
                res.status(200).json({
                    message:"Filtered Orders fetched successfully", 
                    orders:fetchedOrders,
                    maxOrders:ordersCount
                });
            })
            .catch((error)=>{
                // console.log(error);console.log("Unable to get filtered orders")
                res.status(500).json({message:'Failed to fetch filtered Orders!'})
            });
    })
    .catch((error)=>{
        console.log(error);console.log("Unable to get ordersCount")
        res.status(500).json({message:'Failed to fetch Orders Count!'})
    }); 
    
    console.log("ordersCount")
    console.log(ordersCount)

    
}

exports.generateOrderId = (req, res, next)=>{
    
    let fetchedOrders;
    let lastOrder;
    
    // Order.find().sort({"_id":-1}).limit(1).then(order=>{lastOrder=order}).catch(console.log("Unable to get last order"))
    // console.log(lastOrder)
    Order.find()
        .then(orders=>{
            fetchedOrders=orders;
            return Order.count();
        })
        .then(count=>{
            if(fetchedOrders[count-1]){
                lastOrder=fetchedOrders[count-1]
            }else{
                lastOrder={billNo:"0"}
            }
            res.status(200).json({
                message:"Last Order details fetched successfully!!", 
                lastOrderBillNo:lastOrder.billNo,
                maxOrders:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get orders")
            res.status(500).json({message:'Failed to fetch Order GenID!'})
        });
}

exports.getOrder = (req, res, next)=>{
    Order.findById(req.params.id)
        .then(order=>{
            if(order){
                res.status(200).json(order)
            }else{
                res.status(404).json({message:"Order not found"});
            }
        })
        .catch((error)=>{
            // console.log("Found error in getting a Order by ID")
            res.status(500).json({message:'Failed to fetch Order by ID!'})
        })
}

exports.createOrder = (req, res, next) =>{
    console.log(req.body)

    orderDataArray = [];
    for(let i=0;i<req.body.listOfItems.length;i++){
        orderDataArray.push({item_id:"", itemName:"", itemCostPrice: 0, itemSellingPrice: 0, item_qty:0, quantity:0, cpCost:0, spCost:0, profit:0 });
     
        orderDataArray[i].item_id=req.body.listOfItems[i].item_id
        orderDataArray[i].itemName=req.body.listOfItems[i].itemName
        orderDataArray[i].itemCostPrice=req.body.listOfItems[i].itemCostPrice
        orderDataArray[i].itemSellingPrice=req.body.listOfItems[i].itemSellingPrice
        orderDataArray[i].item_qty=req.body.listOfItems[i].item_qty
        orderDataArray[i].quantity=req.body.listOfItems[i].quantity
        orderDataArray[i].quantity_copy=req.body.listOfItems[i].quantity_copy
        orderDataArray[i].cpCost=req.body.listOfItems[i].cpCost
        orderDataArray[i].spCost=req.body.listOfItems[i].spCost
        orderDataArray[i].profit=req.body.listOfItems[i].profit
       
    }

    console.log(orderDataArray);

    /*
        clientName: req.body.clientName,
        clientPhoneNo: req.body.clientPhoneNo,
        amountPaid: req.body.amountPaid,
        totalCost: req.body.totalCost,
        lastUpdatedDate: req.body.lastUpdatedDate,
        purchasedDate: req.body.purchasedDate,
        listOfItems: orderDataArray
        

    */
    const order=new Order({
        billNo:req.body.billNo,
        clientName: req.body.clientName,
        clientPhoneNo: req.body.clientPhoneNo,
        clientAddress: req.body.clientAddress,
        clientGSTIN:req.body.clientGSTIN,
        isInvoiceCreated:req.body.isInvoiceCreated,
        relatedInvoiceId:req.body.relatedInvoiceId,
        amountPaid: req.body.amountPaid,
        totalCost: req.body.totalCost,
        totalProfit: req.body.totalProfit,
        paymentType:req.body.paymentType,
        lastUpdatedDate: req.body.lastUpdatedDate,
        purchasedDate: req.body.purchasedDate,
        businessType:req.body.businessType,
        businessType_copy:req.body.businessType_copy,
        transaction: req.body.transaction,
        listOfItems: orderDataArray,
        creator:req.userData.userId
    });
    console.log(order);
    order.save()
        .then(createdItem=>{
            res.status(201).json({
                message:"Order added successfully!",
                orderId: createdItem._id
            });
        })
        .catch((error)=>{
            console.log(error)
            // console.log("Order NOT saved")
            res.status(500).json({message:'Failed to add Orders!'})
        });
}

exports.updateOrder = (req, res, next)=>{
    orderDataArray = [];
    for(let i=0;i<req.body.listOfItems.length;i++){
        
        orderDataArray.push({item_id:"", itemName:"", itemCostPrice: 0, itemSellingPrice: 0, item_qty:0, quantity:0, cpCost:0, spCost:0, profit:0 });
     
        orderDataArray[i].item_id=req.body.listOfItems[i].item_id
        orderDataArray[i].itemName=req.body.listOfItems[i].itemName
        orderDataArray[i].itemCostPrice=req.body.listOfItems[i].itemCostPrice
        orderDataArray[i].itemSellingPrice=req.body.listOfItems[i].itemSellingPrice
        orderDataArray[i].item_qty=req.body.listOfItems[i].item_qty
        orderDataArray[i].quantity=req.body.listOfItems[i].quantity
        orderDataArray[i].quantity_copy=req.body.listOfItems[i].quantity_copy
        orderDataArray[i].cpCost=req.body.listOfItems[i].cpCost
        orderDataArray[i].spCost=req.body.listOfItems[i].spCost
        orderDataArray[i].profit=req.body.listOfItems[i].profit
    }

    const order = new Order({
        _id:req.body._id,
        billNo:req.body.billNo,
        clientName: req.body.clientName,
        clientPhoneNo: req.body.clientPhoneNo,
        clientAddress: req.body.clientAddress,
        clientGSTIN:req.body.clientGSTIN,
        isInvoiceCreated:req.body.isInvoiceCreated,
        relatedInvoiceId:req.body.relatedInvoiceId,
        amountPaid: req.body.amountPaid,
        totalCost: req.body.totalCost,
        totalProfit: req.body.totalProfit,
        paymentType:req.body.paymentType,
        lastUpdatedDate: req.body.lastUpdatedDate,
        purchasedDate: req.body.purchasedDate,
        businessType:req.body.businessType,
        businessType_copy:req.body.businessType_copy,
        transaction: req.body.transaction,
        listOfItems: orderDataArray,
        creator:req.userData.userId
    })
    
    Order.updateOne({_id:req.params.id, creator: req.userData.userId}, order)
        .then(result=>{
            console.log(result)
            
            if(result.n>0){
                res.status(200).json({message:"Order updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Order not updated")
            res.status(500).json({message:'Failed to update Orders!'})
        })
}

exports.deleteOrder = (req, res, next)=>{
    console.log(req.params.id)
    Order.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            
            if(result.n>0){
                res.status(200).json({message:"Order Deleted!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Order NOT deleted")
            res.status(500).json({message:'Failed to delete Orders!'})
        })
}