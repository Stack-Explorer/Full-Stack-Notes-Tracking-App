import express from "express";
import { checkAuth, login, logout, signup, getUserDataVerifyAndSaveUser, resendOTP } from "../functionality/auth.functionality.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login); // understood
router.post("/logout", logout); // understood
router.post("/signup", signup); // signup 
router.post("/getUserDataVerifyAndSaveUser", getUserDataVerifyAndSaveUser);
router.get("/check", protectRoute, checkAuth);
router.post("/resend-otp", resendOTP);

export default router;