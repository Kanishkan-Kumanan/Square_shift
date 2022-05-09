import mongoose from "mongoose";
 
var Schema = mongoose.Schema;

const ProductSchema = new Schema({
    id : {type:Number,required:true},
    name: {type:String,required:true},
    price: {type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:String,required:true},
    discount_percentage:{type:Number,required:true},
    weight_in_grams:{type:Number,required:true}
});

const Product = mongoose.model('Product',ProductSchema);
export default Product;