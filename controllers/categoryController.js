const Item = require('../models/item');
const Category = require('../models/category'); 
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.category_list = asyncHandler(async (req, res, next) => {
    let allCategories = await Category.find().exec();
    
    res.render('category_list', {
        title: "All Categories",
        categories_list: allCategories
    })
});

exports.category_detail = asyncHandler(async(req, res, next) => {
    let foundCategory = await Category.find({name: { $regex : new RegExp(`^${req.params.name}$`,'i')}}).exec()
    
    foundCategory = foundCategory.length ? foundCategory[0] : null;
    
    if (foundCategory !== null) {
        itemsUnderCategory = await Item.find({
            'category': foundCategory._id
        })
    } else {
        itemsUnderCategory = {};
    }

    res.render('category_detail', {
        title: 'Category Page',
        category: foundCategory,
        items: itemsUnderCategory
    })
})

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render('category_create', {
        title: 'Create New Category'
    })
})

exports.category_create_post = [
    body('category_name', 'Category name cannot be blank')
        .trim()
        .isLength({min: 1})
        .escape(),
    body('category_description', 'Category description cannot be blank')
        .trim()
        .isLength({min: 1})
        .escape(),

    asyncHandler(async(req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.render('category_create',{
                title: 'Create New Category',
                errors: errors.array()
            })
            return;
        } else {
            let categoryExists = await Category.find({name: { $regex : new RegExp(`^${req.body.category_name}$`,'i')}}).exec();
            if (categoryExists.length) {
                res.redirect(`/category/${req.body.category_name}`)
            } else {
                let newCategory = new Category({
                    name: req.body.category_name,
                    description: req.body.category_description,
                })
                newCategory.save()
                res.redirect('/categories');
            }
        }
    })
]

exports.category_delete_get = asyncHandler(async(req, res, next) => {
    let foundCategory = await Category.find({name: { $regex : new RegExp(`^${req.params.name}$`,'i')}}).exec()
    foundCategory = foundCategory.length ? foundCategory[0] : null;
    console.log(foundCategory)
    res.render('category_delete', {
        title: 'Delete Category',
        category: foundCategory,
    })
})


exports.category_delete_post = asyncHandler(async(req, res, next) => {
    let foundCategory = await Category.find({name: { $regex : new RegExp(`^${req.params.name}$`,'i')}}).exec()
    foundCategory = foundCategory.length ? foundCategory[0] : null;
    await Category.findByIdAndRemove(foundCategory);
    res.redirect('/categories')
})