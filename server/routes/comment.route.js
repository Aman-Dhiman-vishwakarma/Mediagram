import express from "express";
import { verifyuser } from "../middleware/verifyuser.js";
import { createComment, getPostComment } from "../controllers/comment.controller.js";
const router = express.Router();

router.post('/postcomment/:postId', verifyuser, createComment)
router.get('/getcomments/:postId', verifyuser, getPostComment)



export default router;