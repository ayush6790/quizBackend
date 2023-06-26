import express from "express";
import { MeUser, createUser, loginUser,forgotPassword, resetPassword } from "../modules/User/User";
import authenticate from "../modules/config/authenticate";
const router = express.Router();

router.post("/create", createUser);
router.post('/login', loginUser)
router.post('/me',authenticate,MeUser)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)

export default router;
