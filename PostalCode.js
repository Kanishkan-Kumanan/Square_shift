import mongoose from "mongoose";
 
var Schema = mongoose.Schema;

const PostalSchema = new Schema({
    postal_code : {type:Number,required:true},
    distance_in_kilometers: {type:Number,required:true}
})

const PostalCode = mongoose.model("PostalCode",PostalSchema);
export default PostalCode;