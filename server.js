import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import UserRouter from "./routes/user.js";
import ProductRouter from "./routes/product.js";
import mongoose from "mongoose"
import Product from "./Models/product.js"
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
dotenv.config();

// Setting Up Ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.static("uploads"));
// Setting Up Session
app.use(
  session({
    secret: "its my key",
    resave: true,
    saveUninitialized: true,
  })
);
const PAGE_SIZE = 5;
// Routing
app.get("/", (req, res)=>{
      res.render("index")
})
app.get('/products', async (req, res) => {
  
  try {
    let loggedIn = req.session.loggedIn;
    const username = req.session.username;
    const profile = req.session.profile;

    const page = req.query.page || 1;
    const skip = (page - 1) * PAGE_SIZE;

    const totalProducts = await Product.countDocuments();
    const data = await Product.find().skip(skip).limit(PAGE_SIZE);
    if(!req.session.loggedIn){
      loggedIn=false
    }
    res.render('products', {
      username,
      data,
      current_page: page,
      total_pages: Math.ceil(totalProducts / PAGE_SIZE),
      loggedIn: loggedIn,
      profile
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Error fetching products");
  }
});
app.get('/admin', async (req, res)=>{
  const profile = req.session.profile;
  const data  = await Product.find();
  req.session.username === 'admin' ? res.render('admin', {data, profile}) :res.redirect("/users/login");
})
app.use("/products",ProductRouter )
app.use("/users", UserRouter);


const mongoURL = `mongodb+srv://parmitachoudharyrck:${process.env.PASSWORD}@cluster0.hvwa9wc.mongodb.net/`;

mongoose.connect(mongoURL).then(()=>{
  app.listen(process.env.PORT, ()=>{
        console.log(`server running on the port number ${process.env.PORT} `)
  })
}).catch((err)=>{console.log(err)})
