import express from "express";
const Prouter = express.Router();
import PostalCode from "../model/PostalCode.js";

Prouter.post("/",async (req,res) =>{
    const newPostal = new PostalCode(req.body);
    try{
        const savedPostal = await newPostal.save();
        res.status(200).json(savedPostal);
    }
    catch(err){
        res.status(500).json(err)
    }
});

export default Prouter;