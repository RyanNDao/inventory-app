const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    company: {type: String, required: true},
    order: [
        {
            item: {type: Schema.Types.ObjectId, ref: "Item", required: true}
        }
    ],
    status: {
        type: String, 
        enum: ["Processing", "Cancelled", "Delivering", "Complete"], 
        default: "Processing", 
        required: true
    }
})

OrderSchema.virtual('url').get(function(){
    return `/order/${this._id}`;
})

OrderSchema.virtual('itemName').get(function(){
    let itemObject = this.order[0].item.name;
    return `${itemObject}`;
})

module.exports = mongoose.model("Order", OrderSchema);
