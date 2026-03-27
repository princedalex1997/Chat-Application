import express from "express";
import {allUsers, loginUser, registerUser} from "../controllers/userControllers.js";
import {protect} from "../middleWare/authMiddleWare.js";

const router = express.Router();

router.route("/userlist").post(registerUser).get(protect,allUsers)
router.route("/login").post(loginUser)

export default router;
