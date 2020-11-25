const express = require('express');
const checkAuth= require("../middleware/check-auth");
const invoiceController = require("../controllers/invoice");
const router=express.Router();

router.get('',checkAuth,invoiceController.getInvoices);

router.get('/genid',checkAuth,invoiceController.generateInvoiceId);

router.get('/:id',checkAuth,invoiceController.getInvoice);

router.post('',checkAuth,invoiceController.createInvoice)

router.put("/:id",checkAuth,invoiceController.updateInvoice);

router.delete('/:id',checkAuth,invoiceController.deleteInvoice);

module.exports=router;

