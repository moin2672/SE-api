const express = require('express');
const customerController=require("../controllers/customer");
const checkAuth= require("../middleware/check-auth");

const router=express.Router();

router.get('',checkAuth,customerController.getCustomers);

router.get('/phone',checkAuth,customerController.getPhoneNo);

router.get('/search',checkAuth,customerController.searchCustomer);

router.get('/:id',checkAuth,customerController.getCustomer);

router.post('',checkAuth,customerController.createCustomer)                                                                                                                                                              

router.put("/:id",checkAuth,customerController.updateCustomer);

router.delete('/:id',checkAuth,customerController.deleteCustomer);

module.exports=router;

