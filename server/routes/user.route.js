import express from "express";
import { followUnfollowUser, getfollowedUsers, getfollowingUsers, getSearchUser, getUserById, suggestedUser, updateUser } from "../controllers/user.controller.js";
import { verifyuser } from "../middleware/verifyuser.js";
import { upload } from "../middleware/multer.middleware.js";
const router = express.Router();

router.get('/getuserbyid/:userId', verifyuser, getUserById)
router.get('/followUnfollowUser/:userId', verifyuser, followUnfollowUser)
router.get('/getsearchuser', verifyuser, getSearchUser)
router.get('/getfolloweduser', verifyuser, getfollowedUsers)
router.get('/getfollowinguser', verifyuser, getfollowingUsers)
router.post('/updateuser', verifyuser, upload.single("file"), updateUser)
router.get('/suggestedusers', verifyuser, suggestedUser)



export default router;