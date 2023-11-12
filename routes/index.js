var express = require('express');

var router = express.Router();
const orderController = require('../controllers/orderController'); 
const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Stacks Inventory Management LLC' });
});

router.get('/items', itemController.item_list);
router.get('/item/create', itemController.item_create_get);
router.post('/item/create', itemController.item_create_post);
router.get('/item/:name', itemController.item_detail);
router.post('/item/:name', itemController.item_detail);
router.get('/item/:name/delete', itemController.item_delete_get);
router.post('/item/:name/delete', itemController.item_delete_post);

router.get('/orders', orderController.order_list);
router.get('/order/create', orderController.order_create_get);
router.post('/order/create', orderController.order_create_post);
router.get('/order/:order_id', orderController.order_detail);
router.post('/order/:order_id', orderController.order_detail);
router.get('/order/:order_id/delete', orderController.order_delete_get);
router.post('/order/:order_id/delete', orderController.order_delete_post);

router.get('/categories', categoryController.category_list);
router.get('/category/create', categoryController.category_create_get);
router.post('/category/create', categoryController.category_create_post);
router.get('/category/:name', categoryController.category_detail);
router.get('/category/:name/delete', categoryController.category_delete_get);
router.post('/category/:name/delete', categoryController.category_delete_post);


module.exports = router;
