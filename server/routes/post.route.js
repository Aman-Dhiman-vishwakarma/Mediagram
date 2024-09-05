import express from "express";
import { createPost, deletePost, getPosts, getUserPosts, likeUnlikePost } from "../controllers/post.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyuser } from "../middleware/verifyuser.js";
const router = express.Router();

router.post('/createpost', verifyuser, upload.single("file"), createPost)
router.get('/getposts', verifyuser, getPosts)
router.get('/getuserposts/:userId', verifyuser, getUserPosts)
router.delete('/deletepost/:postId', verifyuser, deletePost)
router.get('/likeunlikepost/:postId', verifyuser, likeUnlikePost)



export default router;