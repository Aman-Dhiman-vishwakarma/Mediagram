import express from "express";
import { register, signIn, signOut } from "../controllers/auth.controller.js";
const router = express.Router();

router.post('/register', register)
router.post('/login', signIn)
router.get('/signout', signOut)


export default router;