import express from "express";
import { verifyuser } from "../middleware/verifyuser.js";
import { deleteNotification, getUserNotifications } from "../controllers/notification.controller.js";
const router = express.Router();

router.get('/getnotifications', verifyuser, getUserNotifications)
router.delete('/deletenotification/:id', verifyuser, deleteNotification)




export default router;