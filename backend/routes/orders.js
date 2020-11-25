const express = require('express');
const checkAuth= require("../middleware/check-auth");
const orderController = require("../controllers/order");

const router=express.Router();

router.get('',checkAuth, orderController.getOrders);
router.get('/search',checkAuth,orderController.searchOrder);
router.get('/genid',checkAuth,orderController.generateOrderId);
router.get('/:id',checkAuth,orderController.getOrder);
router.post('',checkAuth,orderController.createOrder)
router.put("/:id",checkAuth,orderController.updateOrder);
router.delete('/:id',checkAuth,orderController.deleteOrder);

module.exports=router;