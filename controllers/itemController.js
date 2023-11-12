const Item = require('../models/item');
const Category = require('../models/category'); 
const Order = require('../models/order')
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const {ObjectId} = require('mongodb')

exports.item_list = asyncHandler(async (req, res, next) => {
    let allItems = await Item.find().populate('category').exec();
    console.log(allItems)
    
    res.render('item_list', {
        title: "All Items",
        items_list: allItems
    })
});

exports.item_create_get = asyncHandler(async(req, res, next) => {
    let allCategories = await Category.find().exec();
    res.render('item_create', {
        title: "Create an item",
        allCategories: allCategories
    })
})

exports.item_detail = asyncHandler(async (req, res, next) => {
    let foundItem = await Item.find({name: { $regex : new RegExp(`^${req.params.name}$`,'i')}}).populate('category').exec();
    foundItem = foundItem.length ? foundItem[0] : null;
    let ordersWithItem = await Order.find({
        'order.item': {
            $in: new ObjectId(foundItem._id)
        }
    }).exec();
    ordersWithItem = ordersWithItem.length ? ordersWithItem : null;
    console.log(ordersWithItem, foundItem)
    
    res.render('item_detail', {
        title: "Item Page",
        item: foundItem,
        orders: ordersWithItem,
    })
})


exports.item_create_post = [
    body('item_name','Item name cannot be blank')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('item_description','Item description cannot be blank')
        .trim()
        .isLength({min: 1})
        .escape(),
    
    
    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        let allCategories = await Category.find().exec();
        if (!errors.isEmpty()){
            res.render('item_create', {
                title: 'Create an item',
                allCategories: allCategories,
                errors: errors.array(),
            })
            return;
        } else {
            let itemExists = await Item.find({name: { $regex : new RegExp(`^${req.body.item_name}$`,'i')}}).exec();
            if (itemExists.length) {
                res.redirect(`/item/${req.body.item_name}`)
            } else {
                let foundCategory = await Category.findOne({_id: req.body.item_category}).exec();
                let newItem = new Item({
                    name: req.body.item_name,
                    in_stock_amount: req.body.item_quantity,
                    category: foundCategory,
                    description: req.body.item_description,
                })
                newItem.save()
                res.redirect('/items');
            }
        }
    })
]

exports.item_delete_get = asyncHandler(async (req,res,next) => {
    let foundItem = await Item.find({name: { $regex : new RegExp(`^${req.params.name}$`,'i')}}).populate('category').exec();
    foundItem = foundItem.length ? foundItem[0] : null;
    res.render('item_delete', {
        title: "Delete Item",
        item: foundItem
    })
})


exports.item_delete_post = asyncHandler(async(req, res, next) => {
    let foundItem = await Item.find({name: { $regex : new RegExp(`^${req.params.name}$`,'i')}}).exec();
    foundItem = foundItem.length ? foundItem[0] : null;
    await Item.findByIdAndRemove(foundItem._id);
    res.redirect('/items');
})