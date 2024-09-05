import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { titleCase } from "../utils/capitalUsername.js";

export const register = async (req, res) => {
  try {
    const {fullname, username, email, password, gender } = req.body;

    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !gender ||
      fullname === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      gender === ""
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fiends are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "user allready exist with this information",
      });
    }

    const capitalname = titleCase(fullname)

    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      fullname:capitalname,
      username,
      email,
      password: hashPassword,
      gender,
    });
    await newUser.save();
    res.status(200).json({ success: true, message: "SignUp Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password || username === "" || password === "") {
      return res
        .status(400)
        .json({ success: false, message: "All fiends are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User not exist with this information",
        });
    }
    const verifyPassword = await bcryptjs.compare(password, user.password);
    if (!verifyPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid  information" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = user._doc;
    res
      .status(200)
      .cookie("mediagram_token", token, { httpOnly: true })
      .json({ success: true, user: rest, message: "Signin Successfull" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    res
      .clearCookie("mediagram_token")
      .status(200)
      .json({success:true, message:"User has been signed out"});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
