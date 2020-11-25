const express = require('express');
const checkAuth= require("../middleware/check-auth");
const itemController =  require("../controllers/item");
const router=express.Router();

router.get('',checkAuth, itemController.getItems);
router.get('/search',checkAuth,itemController.searchItem);
router.get('/:id',checkAuth,itemController.getItem);
router.post('',checkAuth,itemController.createItem)
router.put("/:id",checkAuth,itemController.updateItem);
router.delete('/:id',checkAuth,itemController.deleteItem);

module.exports=router;

