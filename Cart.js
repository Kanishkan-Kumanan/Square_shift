import mongoose from "mongoose";
 
var Schema = mongoose.Schema;

const CartSchema = new Schema({
    product_id : {type:Number,required:true},
    name : {type:String,required:true},
    weight_in_grams:{type:Number,required:true},
    price:{type:Number,required:true},
    discount_percentage:{type:Number,required:true},
    quantity: {type:Number,required:true},
    total_weight:{type:Number,required:true},
    total_amount:{type:Number,required:true}
},{versionKey:false});

const Cart = mongoose.model("Cart",CartSchema);
export default Cart;