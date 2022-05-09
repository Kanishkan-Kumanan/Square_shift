import express from "express";

const Crouter = express.Router();
import Cart from "./model/Cart.js";
import { postal_codes } from "./data.js";



export const searchProduct = (arr, value) => {
    var result = { status: "" };
    for (let i in arr) {
      if (arr[i].id == value) {
        result.status = "success";
        result.product = arr[i];
        return result;
      }
    }
    if (result.status === "") {
      result.status = "error";
      result.message =
        "Invalid product id. Valid product id range is 100 to 110.";
      return result;
    }
  };
  export const searchPostalCode = (arr, value) => {
    var result = { status: "" };
    for (let i in arr) {
      if (arr[i].postal_code == value) {
        result.status = "success";
        result.distance_in_kilometers = arr[i].distance_in_kilometers;
        return result;
      }
    }
    if (result.status === "") {
      result.status = "error";
      result.message = "Invalid postal code, valid ones are 465535 to 465545.";
      return result;
    }
  };

  export const addCart = (arr,id,quantity) =>{
     var result = {status:""}; 

     result.status ="success";
     result.message = "Item has been added to cart";

     if (result.status === ""){
      result.status = "error";
      result.message = "Invalid product id";
   }    
      
      return result;
       
     
    
  };

export const getItems = (arr) =>{
    var result = {status : ""};
   
    result.status ="success";
    result.message = "Item available in cart"; 
    
    if(result.status === ""){
      result.status = "error";
      result.message = "Invalid";
    }
    
    return result;
  }

  export const emptyCart = () =>{
    var result = {status : ""};
   
    result.status ="success";
    result.message = "All items have been removed from the cart!"; 
    
    if(result.status === ""){
      result.status = "error";
      result.message = "Invalid";
    }
    
    return result;
  }

  
  
  export const getCheckOut = async (ship_code,arr,callback) =>{

    var sum = 0;
    var cost = 0;
    var dist;
    var amount;
    var total;

    Cart.find((err,carts)=>{
      if(err){
        console.log(err);
      }else{
        for(let i in carts){
          sum = sum + carts[i].total_weight,
          cost = cost + carts[i].total_amount
        }
        
          for(let i in arr){

            if(arr[i].postal_code == ship_code){
              sum = sum / 1000;
               dist = arr[i].distance_in_kilometers,
               amount =  shipping_charge(sum,dist);
               
               total = cost + amount;
               
               total = total.toFixed(3);

               var result = {status : ""};
   
               result.status ="success";
               result.message = `Total value of your shopping cart is $${total}`; 
               
               if(result.status === ""){
                 result.status = "error";
                 result.message = "Invalid";
               }
               
               callback(result);
               
            }
          }
        
      }
    })
  
  }

 
  const shipping_charge =  (total,distance) =>{
   

    if(50 < distance && distance <= 500){
      if(total < 2 ){
       return 50
      }
      else if(2.01 <= total && total <= 5){
       return 55
      }
      else if(5.01 <= total && total <= 20){
       return 80
      }
      else if(total > 20.01){
       return 90
     }
   } 
 
  }
   
  
   
    
        
      
                 
 

       
     
    

  
   
   
   
     
  

