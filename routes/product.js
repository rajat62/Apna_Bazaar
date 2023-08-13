import express from "express";
import { addProduct, addToCart, deleteProduct, getCart, getMoreData, removeProduct, updateProduct } from "../controllers/product.js";


const router = express.Router();

router.get("/getMoreData", getMoreData);
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.delete("/delete", deleteProduct);
router.post('/addProduct', addProduct)
router.delete('/admin/removeProduct', removeProduct)
router.patch('/admin/updateProduct', updateProduct)


export default router;