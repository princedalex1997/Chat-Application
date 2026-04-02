
import express from "express"

import { protect } from "../middleWare/authMiddleWare.js"
import { sendMessage ,fetchAllChats } from "../controllers/messageController.js"

const router = express.Router()


router.route("/").post(protect, sendMessage)
router.route("/:chatId").get(protect, fetchAllChats)

export default router;