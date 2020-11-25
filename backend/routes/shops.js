const express = require('express');
const checkAuth= require("../middleware/check-auth");
const shopController=require("../controllers/shop");

const router=express.Router();

router.get('',checkAuth,shopController.getShops);
router.get('/:id',checkAuth,shopController.getShop);
router.post('',checkAuth,shopController.createShop)                                                                                                                                                              
router.put("/:id",checkAuth,shopController.updateShop);
router.delete('/:id',checkAuth,shopController.deleteShop);

module.exports=router;

