import express from "express";
import { getMoreData } from "../controllers/product.js";

const router = express.Router();

router.get("/getMoreData", getMoreData);


export default router;