const Order = require('../models/order');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


exports.order_list = asyncHandler(async (req, res, next) => {
    let allOrders = await Order.find().populate('order.item').exec();
    res.render('order_list', {
        title: "All Orders",
        orders_list: allOrders
    })
});

exports.order_detail = asyncHandler(async (req, res, next) => {
    let foundOrder = await Order.findById(req.params.order_id).populate('order.item').exec();
    res.render('order_detail', {
        title: 'Order Page',
        order: foundOrder 
    })
})

exports.order_create_get = asyncHandler(async(req, res, next) => {
    let allItems = await Item.find().exec();
    const allStatuses = ["Processing", "Cancelled", "Delivering", "Complete"]
    res.render('order_create', {
        title: 'Create New Order',
        items_list: allItems,
        status_list: allStatuses,
    })
})

exports.order_create_post = [
    body('order_company', 'Company name cannot be blank')
        .trim()
        .isLength({min: 1})
        .escape(),
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const allItems = await Item.find().exec()
        if (!errors.isEmpty()){
            res.render('order_create', {
                title: 'Create New Order',
                items_list: allItems,
                errors: errors.array()
            })
        } else {
            console.log(req.body)
            let foundItem = await Item.find({name: req.body.order_item}).exec();
            console.log(foundItem)
            foundList = [
                {
                    item: foundItem[0]
                }
            ]
            let newOrder = new Order({
                company: req.body.order_company,
                order: foundList,
                status: req.body.order_status,
            })
            newOrder.save()
            res.redirect(`/order/${newOrder._id}`)
        }
    })
]

exports.order_delete_get = asyncHandler(async(req, res, next) => {
    let foundOrder = await Order.findById(req.params.order_id).populate('order.item');
    res.render('order_delete', {
        title: 'Delete Order',
        order: foundOrder,
    })
})

exports.order_delete_post = asyncHandler(async(req, res, next) => {
    await Order.findByIdAndRemove(req.params.order_id);
    res.redirect('/orders')
})