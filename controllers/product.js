import Product from "../Models/product.js"
export const getMoreData = async (req, res)=>{
      const page = req.query.page
      console.log(page);
      const skip = (page - 1) * 5;
      const data = await Product.find().skip(skip).limit(5);
      res.json(data);
}
