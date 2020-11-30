const Customer = require('../models/customer');

var customersCount=0;

exports.getCustomers = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const customerQuery=Customer.find();
    let fetchedCustomers;
    if(pageSize && currentPage){
        customerQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    customerQuery
        .then(customerData=>{
            fetchedCustomers=customerData;
            return Customer.countDocuments();
        })
        .then(count=>{
            res.status(200).json({
                message:"Customers fetched successfully", 
                customers:fetchedCustomers,
                maxCustomers:count
            });
        })
        .catch(error=>{
            res.status(500).json({message:'Fetching Customers failed!'})
        });
}

exports.searchCustomer = (req, res, next)=>{
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const searchText= req.query.searchtext;
   
console.log(req.query);
console.log(searchText)
        
    let customerQuery=Customer.find().sort({customerQuantity:1});
    let fetchedCustomers;
    
    
    if(searchText){
        console.log("inside")
        console.log(searchText)
       
        var regexValue = '\.*'+searchText.toLowerCase().trim()+'\.*';
        const CheckValue =new RegExp(regexValue,'i');
        if(searchText!="" && !isNaN(searchText))
        {
            let searchText_Num=Number(searchText)
            customerQuery=Customer.find({$or:[{'customerName':CheckValue},{'customerQuantity':searchText_Num},{'customerSellingPrice':searchText_Num}]}).sort({customerQuantity:1});
        }else{
            customerQuery=Customer.find({$or:[{'customerName':CheckValue}]}).sort({customerQuantity:1});
        }
        
       
       
        //.find({$or:[{'metadata.userName': CheckValue},{'metadata.originalname': CheckValue},{'clientPhoneNo': CheckValue}]}).sort({uploadDate:-1}).toArray(function(err, files){});
    }

    customerQuery
    .then(customers=>{
        customersCount=customers.length;
        console.log("customers - Count")
        console.log(customersCount)
        if(pageSize && currentPage){
            customerQuery
                .skip(pageSize*(currentPage-1))
                .limit(pageSize)
        }
        customerQuery
            .then(customers=>{
                fetchedCustomers=customers;
                console.log(customers)
                console.log(customers.length)
                console.log(fetchedCustomers.length)
             
            })
            .then(count=>{
                // console.log("count")
                // console.log(count)
                if(searchText!="" || typeof(searchText)!="undefined" ){
                    count= fetchedCustomers.length;
                    // console.log(count)
                }
                console.log(count)
                res.status(200).json({
                    message:"Filtered Customers fetched successfully", 
                    customers:fetchedCustomers,
                    maxCustomers:customersCount
                });
            })
            .catch((error)=>{
                //console.log(error);console.log("Unable to get filtered customers")
                res.status(500).json({message:'Unable to get filtered customers!'});
        });
    })
    .catch((error)=>{
        //console.log(error);console.log("Unable to get customersCount")
        res.status(500).json({message:'Unable to get customersCount!'});
    }); 
    
    console.log("customersCount")
    console.log(customersCount)
  
}

exports.getCustomer = (req, res, next)=>{
    Customer.findById(req.params.id)
        .then(customer=>{
            if(customer){
                res.status(200).json(customer)
            }else{
                res.status(404).json({message:"Customer not found"});
            }
        })
        .catch((error)=>{
            //console.log("Found error in getting a customer by ID")
            res.status(500).json({message:'Unable to get customer by ID!'})
        })
}

exports.getPhoneNo =(req, res, next)=>{
   
    const customerQuery=Customer.find().select({customerPhoneNo:1,_id:0});
    let fetchedCustomers;
    customerQuery
        .then(customerPhoneNoData=>{
            fetchedCustomers=customerPhoneNoData;
            return Customer.countDocuments();
        })
        .then(count=>{
            res.status(200).json({
                message:"Customers P.No fetched successfully", 
                customersPhoneNos:fetchedCustomers,
                maxCustomers:count
            });
        })
        .catch((error)=>{
            // console.log("Unable to get customer PhoneNo Data")
            res.status(500).json({message:'Failed to fetch Customers P.No!'})
        });
}


exports.createCustomer = (req, res, next) =>{
    const customer=new Customer({
        customerName: req.body.customerName,
        customerPhoneNo: req.body.customerPhoneNo,
        customerAddress: req.body.customerAddress,
        customerEmail: req.body.customerEmail,
        customerGSTIN: req.body.customerGSTIN,
        creator:req.userData.userId
    });
    console.log(customer);
    customer.save()
        .then(createdCustomer=>{
            res.status(201).json({
                message:"Customer added successfully!",
                customerId: createdCustomer._id
            });
        })
        .catch((error)=>{
            console.log(error)          
            //console.log("Customer NOT saved")
            res.status(500).json({message:'Unable to add customer!'})
        });
}

exports.updateCustomer = (req, res, next)=>{
    const customer = new Customer({
        _id:req.body._id,
        customerName: req.body.customerName,
        customerPhoneNo: req.body.customerPhoneNo,
        customerAddress: req.body.customerAddress,
        customerEmail: req.body.customerEmail,
        customerGSTIN:req.body.customerGSTIN,
        creator:req.userData.userId
    })
    Customer.updateOne({_id:req.params.id, creator: req.userData.userId}, customer)
        .then(result=>{
            console.log(result)
            if(result.n>0){
                res.status(200).json({message:"Customer updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
            
        })
        .catch((error)=>{
            // console.log("Customer not updated")
            res.status(500).json({message:'Unable to update customer!'})
        })
}

exports.deleteCustomer = (req, res, next)=>{
    console.log(req.params.id)
    Customer.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            
            if(result.n>0){
                res.status(200).json({message:"Customer Deleted!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Customer NOT deleted")
            res.status(500).json({message:'Unable to delete customer!'})
        })
}