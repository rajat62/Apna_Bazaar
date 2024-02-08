import Product from "../Models/product.js";
import Cart from "../Models/cart.js"
import client from "../helpers/redis_init.js";

export const getMoreData = async (req, res) => {
  const page = req.query.page;
  console.log(page);
  const skip = (page - 1) * 5;
  const data = await Product.find().skip(skip).limit(5);
  res.json(data);
};

export const getCart = async (req, res)=>{
      
  let userData = await client.HGET("user:1", "userData");
  userData = JSON.parse(userData)
  const loggedIn = userData.loggedIn;
  const username = userData.username;
  const profile = userData.profilepic;

      try {
        const productsArray = await Cart.find({username});
        const productsId = productsArray.map((item) => item.productId);
        
        const finalData = await Product.find({
          _id: { $in: productsId }
        });
        
        loggedIn
            ? res.render('cart', {loggedIn, username, profile, finalData})
            : res.redirect("/users/login")

      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
      
}

export const addToCart = async (req, res)=>{
  const itemId = req.query.itemId;
  
  let userData = await client.HGET("user:1", "userData");
  userData = JSON.parse(userData)
  const username = userData.username;
  
  const response = await Cart.create({
    username,
    productId: itemId
  })
  console.log(response);
  res.send("Added")
}


export const deleteProduct = async (req, res) => {
  const itemId = req.query.itemId;

  let userData = await client.HGET("user:1", "userData");
  userData = JSON.parse(userData)
  const username = userData.username;
  
  try {
    const response = await Cart.deleteOne({username, productId: itemId});
    console.log(response);

    res.send("data deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product from cart.' });
  }
};



export const addProduct = async(req, res)=>{
  let userData = await client.HGET("user:1", "userData");
  userData = JSON.parse(userData)
  const profile = userData.profilepic
  await Product.create(req.body);
  const data = await Product.find();
  res.render('admin', {data, profile})
}
export const removeProduct = async(req, res)=>{
  const itemId = req.query.itemId;

  try {
    const response = await Product.deleteOne({_id: itemId});
    console.log(response);
    res.send("data deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product from cart.' });
  }
}

export const updateProduct = async (req, res)=>{
   const itemId = req.query.itemId;
   const quantity = req.query.quan;

   try {
      await Product.findOneAndUpdate({_id: itemId}, {$set: {quantity: quantity}});
      res.send("Updated")
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Unable to update.' });
    }

}