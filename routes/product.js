import express from "express";
import { addToCart, getCart, getMoreData } from "../controllers/product.js";


const router = express.Router();

router.get("/getMoreData", getMoreData);
router.get("/cart", getCart);
router.post("/cart", addToCart);


export default router;