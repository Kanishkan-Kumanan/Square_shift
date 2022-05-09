import express from "express";
const router = express.Router();
import Product from "../model/Product.js";

router.post("/",async (req,res)=>{
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
     }
    catch(err){
        res.status(500).json(err);
    }
});

export default router;