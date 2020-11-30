const Invoice = require('../models/invoice');

exports.getInvoices = (req, res, next)=>{
    console.log("generateInvoiceNo()")
    console.log(generateInvoiceNo())
    const pageSize=+req.query.pagesize;
    const currentPage= +req.query.currentpage;
    const invoiceQuery=Invoice.find();
    let fetchedInvoices;
    if(pageSize && currentPage){
        invoiceQuery
            .skip(pageSize*(currentPage-1))
            .limit(pageSize)
    }
    invoiceQuery
        .then(invoiceBills=>{
            fetchedInvoices=invoiceBills;
            return Invoice.countDocuments();
        })
        .then(count=>{
            res.status(200).json({
                message:"Invoices fetched successfully", 
                invoices:fetchedInvoices,
                maxInvoices:count
            });
        })
        .catch((error)=>{
            //console.log("Unable to get invoice Bills")
            res.status(500).json({message:'Fetching invoice Bills failed!'})
        });
}

isNumeric=(num)=> {
    return !isNaN(num);
  }
  padLeft=(nr, n, str)=> {
    return Array(n - String(nr).length + 1).join(str || "0") + nr;
  }

  generateInvoiceNo=()=>{

    
        
    

  }
exports.generateInvoiceId = (req, res, next)=>{
    
    let fetchedInvoices;
    let lastInvoice;
    
    // Invoice.find().sort({"_id":-1}).limit(1).then(order=>{lastInvoice=order}).catch(console.log("Unable to get last order"))
    // console.log(lastInvoice)
    Invoice.find()
        .then(invoice=>{
            fetchedInvoices=invoice;
            return Invoice.countDocuments();
        })
        .then(count=>{
            if(fetchedInvoices[count-1]){
                lastInvoice=fetchedInvoices[count-1]
            }else{
                lastInvoice={invoiceNo:"0"}
            }
            res.status(200).json({
                message:"Last Invoice details fetched successfully!!", 
                lastInvoiceNo:lastInvoice.invoiceNo,
                maxInvoices:count
            });
        })
        .catch((error)=>{
            //console.log("Unable to get invoice")
            res.status(500).json({message:'Failed to get invoice GenID!'})
        });
}

exports.getInvoice = (req, res, next)=>{
    Invoice.findById(req.params.id)
        .then(invoice=>{
            if(invoice){
                res.status(200).json(invoice)
            }else{
                res.status(404).json({message:"Invoice not found"});
            }
        })
        .catch((error)=>{
            // console.log("Found error in getting a invoice by ID")
            res.status(500).json({message:'Fetching invoice by ID failed!'});
        })
}

exports.createInvoice = (req, res, next) =>{
    let fetchedInvoices;
    let lastInvoice;
    Invoice.find()
        .then(invoice=>{
            fetchedInvoices=invoice;
            return Invoice.countDocuments();
        })
        .then(count=>{
            if(fetchedInvoices[count-1]){
                lastInvoice=fetchedInvoices[count-1]
            }else{
                lastInvoice={invoiceNo:"0"}
            }
           
            let lastInvoiceNo=lastInvoice.invoiceNo;
            let maxInvoiceCount = count;
    let lastBillNo_num = 0;
    let gen_InvoiceNo_Val="";
    if(lastInvoiceNo!="" && isNumeric(lastInvoiceNo)){
        lastBillNo_num=Number(lastInvoiceNo)
    }
    
    if (lastBillNo_num >= maxInvoiceCount) {
          gen_InvoiceNo_Val =
            padLeft(lastBillNo_num + 1, 5, "0");
          //console.log("last bill no");
        } else {
          gen_InvoiceNo_Val =
            padLeft(maxInvoiceCount + 1, 5, "0");
          //console.log("max invoice");
        }
        // console.log("gen_InvoiceNo_Val");
        // console.log(gen_InvoiceNo_Val);
        const invoice=new Invoice({
            invoiceNo:gen_InvoiceNo_Val,
            orderId:req.body.orderId ,
            orderBillNo:req.body.orderBillNo ,
            HSNcode: req.body.HSNcode ,
            SGST: req.body.SGST ,
            CGST: req.body.CGST ,
            IGST: req.body.IGST ,
            eWayBillNo:req.body.eWayBillNo ,
            vehicleNo:req.body.vehicleNo ,
            transporterName:req.body.transporterName ,
            lastUpdatedDate:req.body.lastUpdatedDate,
            creator:req.userData.userId
            });
            console.log(invoice);
            invoice.save()
                .then(createdInvoice=>{
                    res.status(201).json({
                        message:"Invoice added successfully!",
                        invoiceId: createdInvoice._id
                    });
                })
                .catch((error)=>{
                    // console.log("Invoice NOT saved")
                    res.status(500).json({message:'Failed to add Invoice!'})
                });
        })
        .catch((error)=>{
            console.log(error)
            //res.status(500).json({message:'Failed to get invoice GenID!'})
        });

    
}

exports.updateInvoice = (req, res, next)=>{
    const invoice = new Invoice({
        _id:req.body._id,
        invoiceNo:req.body.invoiceNo,
        orderId:req.body.orderId ,
	orderBillNo:req.body.orderBillNo ,
	HSNcode: req.body.HSNcode ,
	SGST: req.body.SGST ,
	CGST: req.body.CGST ,
	IGST: req.body.IGST ,
	eWayBillNo:req.body.eWayBillNo ,
	vehicleNo:req.body.vehicleNo ,
	transporterName:req.body.transporterName ,
    lastUpdatedDate:req.body.lastUpdatedDate,
    creator:req.userData.userId
    })
    Invoice.updateOne({_id:req.params.id, creator: req.userData.userId}, invoice)
        .then(result=>{
            console.log(result)
            
            if(result.n>0){
                res.status(200).json({message:"Invoice updated successfully!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Invoice not updated")
            res.status(500).json({message:'Failed to update Invoice!'})
        })
}

exports.deleteInvoice = (req, res, next)=>{
    console.log(req.params.id)
    Invoice.deleteOne({_id:req.params.id, creator: req.userData.userId})
        .then(result=>{
            console.log(result);
            
            if(result.n>0){
                res.status(200).json({message:"Invoice Deleted!"});
            }else{
                res.status(401).json({message:"Not Authorized"})
            }
        })
        .catch((error)=>{
            // console.log("Invoice NOT deleted")
            res.status(500).json({message:'Failed to delete Invoice!'})
        })
}