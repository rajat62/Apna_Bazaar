import express from "express";
import { addUser, changePassword, forgotPassword, forgotPasswordPost, loginPage, logoutUser, resetPassword, signupPage, userLogin, verifyUser } from "../controllers/user.js";
const router = express.Router();
import upload from '../middlewares/multer.js'; 

router.get("/login", loginPage);
router.get("/signup", signupPage);
router.post("/addUser", upload.single('avatar'), addUser);
router.post("/login", userLogin);
router.post("/logout", logoutUser);
router.get("/verify", verifyUser);
router.get("/forgotPassword", forgotPassword);
router.post("/forgotPassword", forgotPasswordPost);
router.get("/resetpassword", resetPassword);
router.post("/resetpassword", changePassword);

export default router;