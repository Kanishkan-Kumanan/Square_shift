import express,{json}  from "express";
const app = express();
import {postal_codes,products} from "./data.js";
import cors from "cors";
import {searchPostalCode,searchProduct,addCart,getItems,emptyCart,getCheckOut} from "./helperFunction.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Cart from "./model/Cart.js";


import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import router from "./routes/products.js";
import Prouter from "./routes/postalcodes.js";



app.use(json());

dotenv.config();



mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser : true,
  useUnifiedTopology: true,
},()=>{console.log("DB is connected")}
);

app.use("/api/products",router);
app.use("/api/postalcodes",Prouter);


const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Product API",
        version: "1.0.0",
        description: "Backend API for products",
      },
      servers: [
        {
          url: "https://pure-eyrie-61306.herokuapp.com/",
        },
      ],
    },
    apis: ["./server.js"],
  };
  const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  };
  const specs = swaggerJsdoc(options);
  app.use(cors(corsOptions));
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  /**
   * @swagger
   * components:
   *   schemas:
   *    Product:
   *       type: object
   *       required:
   *         - id
   *       properties:
   *         id:
   *           type: number
   *         name:
   *           type: string
   *           description: The product name
   *         price:
   *           type: number
   *           description: The Product Price
   *         description:
   *           type: string
   *           description: The product description
   *         category:
   *           type: string
   *           description: The product category
   *         image:
   *           type: string
   *           description: The product image
   *         discount_percentage:
   *           type: number
   *           description: The product discount_percentage
   *         weight_in_grams:
   *           type: number
   *           description: The product weight_in_grams
   *       example:
   *         id: 1
   *         name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"
   *         price: 109.95
   *         description: Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday
   *         category: men's clothing
   *         image:  https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg,
   *         discount_percentage: 3.2,
   *         weight_in_grams: 670,
   *    Warehouse:
   *        type: object
   *        required:
   *        properties:
   *         postal_code:
   *           type: number
   *         distance_in_kilometers:
   *           type: number
   *        example:
   *             postal_code: 465535
   *             distance_in_kilometers: 200.35
   * 
   *    CartSuccess:
   *          example:
   *              status: success
   *              message: Item has been added to the cart
   *              
   *    CartFailure :
   *          example:
   *              status: error
   *              message: Invalid product id
   * 
   *    Item :
   *          example:
   *              product_id: 101
   *              quantity : 10
   * 
   *    CartItems:
   *          example:
   *               status: success
   *               message: Item available in the cart
   *               type : array
   *               items : 
   *                     product_id: 101
   *                     decription: Name of Product 1
   *                     quantity :  3 
   * 
   *    CheckOut :
   *          example:
   *               status : success
   *               message : Total value of your shopping cart is $12,500.35
   * 
   *    CartEmptyAction :
   *          example:
   *               action : empty_cart
   * 
   *    CartEmptySuccess:
   *          example :
   *               state : success
   *               message: All items have been removed from the cart   
   *                      
   */

  /**
 * @swagger
 * /warehouse/distance:
 *   get:
 *     summary: Returns distance from warehouse to delivery address
 *     tags: [Warehouse]
 *     parameters:
 *       - in: query
 *         name: postal_code
 *         schema:
 *           type: number
 *         required: true
 *         description: Delivery address postal code
 *     responses:
 *       200:
 *         description: Distance in KM
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 *       400:
 *         description: Invalid postal code, valid ones are 465535 to 465545.
 */
app.get("/warehouse/distance", async (req, res) => {
    if (postal_codes.length > 0) {
      const result = searchPostalCode(postal_codes, req.query.postal_code);
      if (result.status === "error") res.status(400).send(result);
      else res.status(200).send(result);
    } else res.status(200).send("Invalid Postal Code");
  });

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Returns product info
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product id
 *     responses:
 *       200:
 *         description: Product info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product id. Valid product id range is 100 to 110.
 */
 app.get("/product/:id", async (req, res) => {
    if (products.length > 0) {
      const result = searchProduct(products, req.params.id);
      if (result.status === "error") res.status(400).send(result);
      else res.status(200).send(result);
    } else res.status(200).send("Product not available");
  }); 
  
  /**
   * @swagger
   * /cart/item:
   *   post:
   *     summary : Add a item in cart
   *     tags : [Cart] 
   *     parameters:
   *          - in : query
   *            name : product_id
   *            schema : 
   *               type: number
   *               required: true
   *               description : Product_Id of product
   *          - in : query 
   *            name : quantity
   *            schema :
   *               type: number
   *               required: true
   *               description : Quantity of product
   *                
   *     responses: 
   *       200 :
   *          description : Item added
   *          content:
   *           application/json:
   *                schema:
   *                 type : array
   *                 items:
   *                   $ref: '#/components/schemas/CartSuccess'
   *       400 :
   *           description : Error state
   *           content :
   *            application/json:
   *                schema :
   *                 type : array
   *                 items:
   *                   $ref: '#/components/schemas/CartFailure'               
   */

  app.post("/cart/item",async (req,res)=>{
    for (let i in products){
      if (products[i].id == req.query.product_id){
        const newCart = new Cart({
          product_id : req.query.product_id,
          name : products[i].name,
          weight_in_grams:products[i].weight_in_grams,
          price:products[i].price,
          discount_percentage:products[i].discount_percentage,
          quantity:req.query.quantity,
          total_weight:  products[i].weight_in_grams * req.query.quantity,
          total_amount: (products[i].price -(products[i].price * products[i].discount_percentage/100)) * req.query.quantity        
        });
        try{
          const savedCart =  await newCart.save();
        }
        catch(err){
          res.status(500).json(err)
        }
      }
    }
   
   
     const result = addCart(products,req.query.product_id,req.query.quantity);
     if(result.status === "error") res.status(400).send(result);
     else res.status(200).send(result);
  });

/**
 * @swagger
 * /cart/items :
 *       get:
 *         summary : Gets all items in the cart
 *         tags: [Cart] 
 *            
 *         responses:
 *            200:
 *             description: Product Info
 *             content :
 *                application/json:
 *                  schema:
 *                   type : array
 *                   items :
 *                    $ref : '#/components/schemas/CartItems' 
 * 
 *            400 :
 *              description : Cart is empty   
 */ 

app.get("/cart/items",async(req,res)=>{
  const result = getItems(Cart);
  Cart.find({},{_id:0,weight_in_grams:0,price:0,discount_percentage:0,total_weight:0,total_amount:0},function(err,carts){
    if(err){
      console.log(err); 
      res.status(400).send(result);     
    } else{
       console.log(carts);
       result.items = carts;
       res.status(200).send(result);
         }
  });  
 
});

/**
 * @swagger
 * /cart/items:
 *     post :
 *       summary: Empty the cart
 *       tags : [Cart] 
 *       
 *           
 *       responses:
 *         200 :
 *            description: Item Added
 *            content:
 *                application/json:
 *                   schema:
 *                    type: array
 *                    items:
 *                      $ref: '#/components/schemas/CartEmptySuccess'
 * 
 *         400 :
 *             description: Error State. Bad Request
 */

 app.post("/cart/items",async(req,res)=>{
   const result = emptyCart();
   Cart.deleteMany({},function(err,comp){
    if(err){
      console.log(err);
      res.status(400).send(result); 
    }else{
      console.log("Cart is deleted");
      res.status(200).send(result);
    }
   })
 });

 /**
  * @swagger
  * /cart/checkout-value:
  *     get :
  *      summary: Get total amount
  *      tags: [Cart]
  *      parameters:
  *            - in : query
  *              name : shipping_postal_code
  *              schema:
  *              type: number
  *              required: true
  *              description: Get calculated total amount for all products in cart with shipping charge.
  *      responses:
  *         200:
  *           description : Distance in km
  *           content :
  *             application/json:
  *               schema:
  *                 type: array
  *                 items:
  *                   $ref: '#/components/schemas/CheckOut'
  *   
  *         400 :
  *            description : Invalid post code, valid ones are 465535 to 465545   
  */
  
 app.get("/cart/checkout-value",async (req,res)=>{
  
  const result = getCheckOut(req.query.shipping_postal_code,postal_codes,result=>{
    if(result.status === "error") res.status(400).send(result);
    else res.status(200).send(result); 
  });
    
   
 });

app.listen(process.env.PORT || 8080,function(){
    console.log("App is running");
})