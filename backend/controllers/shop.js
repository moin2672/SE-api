const Shop = require('../models/shop');

exports.getShops = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const shopQuery=Shop.find();
    let fetchedShops;
    if(pageSize && currentPage){
        shopQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    shopQuery
        .then(shopData=>{
            fetchedShops=shopData;
            return Shop.count();
        })
        .then(count=>{
            res.status(200).json({
                message:"Shops fetched successfully", 
                shops:fetchedShops,
                maxShops:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get Shops")
            res.status(500).json({message:'Failed to fetch Shops Detail!'})
        });
}

exports.getShop = (req, res, next)=>{
    Shop.findById(req.params.id)
        .then(shop=>{
            if(shop){
                res.status(200).json(shop)
            }else{
                res.status(404).json({message:"Shop not found"});
            }
        })
        .catch((error)=>{
            // console.log("Found error in getting a shop by ID")
            res.status(500).json({message:'Failed to fetch Shop Details by ID!'})
        })
}

exports.createShop = (req, res, next) =>{
    const shop=new Shop({
        shopName: req.body.shopName,
        shopPhoneNo: req.body.shopPhoneNo,
        shopAddress: req.body.shopAddress,
        shopEmail: req.body.shopEmail,
        shopGSTIN: req.body.shopGSTIN,
        shopConditions:req.body.shopConditions,
        creator:req.userData.userId
    });
    console.log(shop);
    shop.save()
        .then(createdShop=>{
            res.status(201).json({
                message:"Shop added successfully!",
                shopId: createdShop._id
            });
        })
        .catch((error)=>{
            console.log(error)          
            // console.log("Shop NOT saved")
            res.status(500).json({message:'Failed to add Shop Details!'})
        });
}

exports.updateShop = (req, res, next)=>{
    const shop = new Shop({
        _id:req.body._id,
        shopName: req.body.shopName,
        shopPhoneNo: req.body.shopPhoneNo,
        shopAddress: req.body.shopAddress,
        shopEmail: req.body.shopEmail,
        shopGSTIN:req.body.shopGSTIN,
        shopConditions:req.body.shopConditions,
        creator:req.userData.userId
    })
    Shop.updateOne({_id:req.params.id, creator: req.userData.userId}, shop)
        .then(result=>{
            console.log(result)
            
            if(result.n>0){
                res.status(200).json({message:"Shop updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Shop not updated")
            res.status(500).json({message:'Failed to update Shop Details!'})
        })
}

exports.deleteShop = (req, res, next)=>{
    console.log(req.params.id)
    Shop.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            
            if(result.n>0){
                res.status(200).json({message:"Shop Deleted!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            console.log("Shop NOT deleted")
            res.status(500).json({message:'Failed to delete Shop Details!'})
        })
}