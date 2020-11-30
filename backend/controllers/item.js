const Item = require('../models/item');

var itemsCount=0;

exports.getItems =(req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const itemQuery=Item.find();
    let fetchedItems;
    if(pageSize && currentPage){
        itemQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    itemQuery
        .then(products=>{
            fetchedItems=products;
            return Item.countDocuments();
        })
        .then(count=>{
            res.status(200).json({
                message:"Items fetched successfully", 
                items:fetchedItems,
                maxItems:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get products")
            res.status(500).json({message:'Failed to fetch Items!'})
        });
}

exports.searchItem = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
   
console.log(req.query);
console.log(searchText)
        
    let itemQuery=Item.find().sort({itemQuantity:1});
    let fetchedItems;
    
    
    if(searchText){
        console.log("inside")
        console.log(searchText)
       
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
        if(searchText!="" && !isNaN(searchText))
        {
            let searchText_Num=Number(searchText)
            itemQuery=Item.find({$or:[{'itemName':CheckValue},{'itemQuantity':searchText_Num},{'itemSellingPrice':searchText_Num}]}).sort({itemQuantity:1});
        }else{
            itemQuery=Item.find({$or:[{'itemName':CheckValue}]}).sort({itemQuantity:1});
        }
        
       
       
        //.find({$or:[{'metadata.userName': CheckValue},{'metadata.originalname': CheckValue},{'clientPhoneNo': CheckValue}]}).sort({uploadDate:-1}).toArray(function(err, files){});
    }

    itemQuery
    .then(items=>{
        itemsCount=items.length;
        console.log("items - Count")
        console.log(itemsCount)
        if(pageSize && currentPage){
            itemQuery
                .skip(pageSize*(currentPage-1))
                .limit(pageSize)
        }
        itemQuery
            .then(items=>{
                fetchedItems=items;
                console.log(items)
                console.log(items.length)
                console.log(fetchedItems.length)
             
            })
            .then(count=>{
                // console.log("count")
                // console.log(count)
                if(searchText!="" || typeof(searchText)!="undefined" ){
                    count= fetchedItems.length;
                    // console.log(count)
                }
                console.log(count)
                res.status(200).json({
                    message:"Filtered Items fetched successfully", 
                    items:fetchedItems,
                    maxItems:itemsCount
                });
            })
            .catch((error)=>{
                // console.log(error);console.log("Unable to get filtered items")
                res.status(500).json({message:'Failed to fetch filtered Items!'})
            });
    })
    .catch((error)=>{
        // console.log(error);console.log("Unable to get itemsCount")
        res.status(500).json({message:'Failed to fetch Items Count!'})
    }); 
    
    console.log("itemsCount")
    console.log(itemsCount)

    
}

exports.getItem = (req, res, next)=>{
    Item.findById(req.params.id)
        .then(item=>{
            if(item){
                res.status(200).json(item)
            }else{
                res.status(404).json({message:"Item not found"});
            }
        })
        .catch((error)=>{
            // console.log("Found error in getting a item by ID")
            res.status(500).json({message:'Failed to fetch Items by ID!'})
        })
}

exports.createItem = (req, res, next) =>{
    const item=new Item({
        itemName: req.body.itemName,
        itemSellingPrice: +req.body.itemSellingPrice,
        itemCostPrice: +req.body.itemCostPrice,
        itemQuantity: +req.body.itemQuantity,
        itemHSN:req.body.itemHSN,
        creator:req.userData.userId
    });
    console.log(item);
    item.save()
        .then(createdItem=>{
            res.status(201).json({
                message:"Item added successfully!",
                itemId: createdItem._id
            });
        })
        .catch((error)=>{
            console.log("Item NOT saved")
            res.status(500).json({message:'Failed to add Item!'})
        });
}

exports.updateItem =(req, res, next)=>{
    Item.findById(req.params.id)
        .then(itemDoc=>{
            if(itemDoc){
                //res.status(200).json(item)
                console.log("itemDoc")
                console.log(itemDoc)
                console.log("200-item")

                const item = new Item({
                    _id:req.body._id,
                    itemName: req.body.itemName,
                    itemSellingPrice: +req.body.itemSellingPrice,
                    itemCostPrice: +req.body.itemCostPrice,
                    itemQuantity: +req.body.itemQuantity,
                    itemHSN:req.body.itemHSN,
                    creator:itemDoc.creator
                })
                console.log("creating item")
                console.log(item)


                // console.log(found_Item.schema.paths)
                //console.log(found_Item.creator)
                Item.updateOne({_id:req.params.id, creator: itemDoc.creator}, item)
                    .then(result=>{
                        console.log("result")
                        console.log(result)
                        
                        if(result.n>0){
                            res.status(200).json({message:"Item updated successfully!"});
                        }else{
                            console.log("Item Update -> Not Authorized")
                            res.status(401).json({message:"Not Authorized"})
                        }
                    })
                    .catch((error)=>{
                        console.log("Item not updated")
                        res.status(500).json({message:'Failed to update Item!'})
                    })
            }else{
                console.log("item not found")
                res.status(404).json({message:"Item not found"});
            }
            // console.log(itemDoc);
            // console.log(itemDoc.creator);
        })
        .catch((error)=>{
            console.log("Found error in getting a item by ID")
            res.status(500).json({message:'Failed to fetch Items by ID!'})
        })
    
}

exports.deleteItem = (req, res, next)=>{
    console.log(req.params.id)
    Item.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            
            if(result.n>0){
                res.status(200).json({message:"Item Deleted!"})
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Item NOT deleted")
            res.status(500).json({message:'Failed to delete Item!'})
        })
}