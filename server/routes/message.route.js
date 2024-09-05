import express from "express";
import { verifyuser } from "../middleware/verifyuser.js";
import { conversationUsers, getMessage, sendMessage } from "../controllers/message.controller.js";
const router = express.Router();

router.post('/sendmessage/:reciver', verifyuser, sendMessage)
router.get('/getmessage/:reciver', verifyuser, getMessage)
router.get('/conversationusers', verifyuser, conversationUsers)



export default router;