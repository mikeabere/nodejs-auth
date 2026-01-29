import express from "express";
import rateLimit from "express-rate-limit";
import * as auth from "../controllers/auth.controller.js";


const router = express.Router();


const limiter = rateLimit({ windowMs: 60 * 1000, max: 5 });

//router.get("/users/me", auth.register);
//router.get("/admin/dashboard",authenticate, auth.register);
router.post("/register", auth.register);
router.post("/login", limiter, auth.login);
router.post("/refresh", auth.refresh);
router.post("/logout", auth.logout);
router.post("/forgot-password", limiter, auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);


export default router;

