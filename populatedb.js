#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const Item = require('./models/item');
const Order = require('./models/order');

const categories = [];
const items = [];
const orders = []


const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0]

main()
    .catch((err)=>console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    await createOrders();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}


async function categoryCreate(index, name, description){
    const category = new Category({name: name, description: description})
    await category.save();
    categories[index] = category;
    console.log(`Added category: ${name}`)
}

async function itemCreate(index, name, description, category, in_stock_amount){
    const itemDetails = {
        name: name,
        description: description,
        in_stock_amount: in_stock_amount,
        category: category
    }
    const item = new Item(itemDetails);

    await item.save();
    items[index] = item
    console.log(`Added item: ${name}`)
}

async function orderCreate(index, order, company, status){
    const orderObject = new Order({
        order: order,
        company: company,
        status: status
    })
    await orderObject.save();
    orders[index] = orderObject;
    console.log(`Added order for company: ${orderObject.company}`);
}

async function createCategories(){
    console.log("Adding categories")
    await Promise.all([
        categoryCreate(0, "Tech", "These are technological items"),
        categoryCreate(1, "Home & Garden", "These are items that can help furnish a house or garden"),
        categoryCreate(2, "Toys", "These are items that can be enjoyed and can bring joy to any child or adult")
    ])
}

async function createItems(){
    console.log("Adding items")
    await Promise.all([
        itemCreate(0, 
            "Laptop", 
            "Portable device used to browse the internet and run applications", 
            categories[0], 
            5
        ),
        itemCreate(1, 
            "Smartwatch", 
            "A watch that has technological capabilities", 
            categories[0], 
            2
        ),
        itemCreate(2, 
            "Wireless Earbuds", 
            "Earbuds that can be worn without a wire", 
            categories[0], 
            14
        ),
        itemCreate(3, 
            "Kitchen Table Set", 
            "A set for a kitchen that comes with a kitchen table and four chairs", 
            categories[1], 
            5
        ),
        itemCreate(4, 
            "Flower Pot", 
            "A place where flowers can be planted and placed in", 
            categories[1], 
            56
        ),
        itemCreate(5, 
            "Knife Set", 
            "A set of professional grade knives", 
            categories[1], 
            9
        ),
        itemCreate(6, 
            "Fertilizer", 
            "Material that can be used to speed up plant growth or making explosives", 
            categories[1], 
            13
        ),
        itemCreate(7, 
            "Pots & Pans", 
            "Items used in the kitchen to prepare food", 
            categories[1], 
            132
        ),
        itemCreate(8, 
            "Rubix Cube", 
            "A perplexing puzzle toy that challenges people of all ages", 
            categories[2], 
            142
        ),
    ])
}

async function createOrders(){
    console.log("Adding orders")
    await Promise.all([
        orderCreate(0, 
        [
            {
                item: items[8],
            }
        ],
        "ABC Toys",
        "Delivering"),
        orderCreate(1, [
            {
                item: items[6],
            }
        ],
        "Totally Normal Company LLC",
        "Complete"),
        orderCreate(2, [
            {
                item: items[1],
            }
        ],
        "Tech Bros & Comp.",
        "Cancelled"),
    ])
}