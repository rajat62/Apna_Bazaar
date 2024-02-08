import express from "express";
import bodyParser from "body-parser";
import UserRouter from "./routes/user.js";
import ProductRouter from "./routes/product.js";
import Product from "./Models/product.js"
const app = express();

import ("./helpers/mongo_init.js");
import client from "./helpers/redis_init.js";
import dotenv from 'dotenv';
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Setting Up Ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("uploads"));

const PAGE_SIZE = 5;


// Routing
app.get("/", (req, res)=>{
      res.render("index")
})
app.get('/products', async (req, res) => {
  
  try {

    let userData = await client.HGET('user:1', 'userData');
    userData = JSON.parse(userData);
    
    const loggedIn = userData ? loggedIn: false;
    const username = userData? username: null;
    const profile = userData? profilepic: null;

    const page = req.query.page || 1;
    const skip = (page - 1) * PAGE_SIZE;

    const totalProducts = await Product.countDocuments();
    const data = await Product.find().skip(skip).limit(PAGE_SIZE);
    
    res.render('products', {
      username,
      data,
      current_page: page,
      total_pages: Math.ceil(totalProducts / PAGE_SIZE),
      loggedIn,
      profile
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});
app.get('/admin', async (req, res)=>{
  let userData = await client.HGET("user:1", "userData");
  userData = JSON.parse(userData)
  const profile = userData.profilepic;
  const username = userData.username;

  const data  = await Product.find();
  username === 'admin' ? res.render('admin', {data, profile}) :res.redirect("/users/login");
})

app.use("/products",ProductRouter )
app.use("/users", UserRouter);


app.listen(process.env.PORT, ()=>{
        console.log(`Server running on the port number ${process.env.PORT} `)
})
