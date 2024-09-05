import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { io, reciversocketid } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    const currentUser = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    if (req.params.userId == req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "you can't follow yourself" });
    }
    const checkFollowUser = user.followers.includes(req.user.id);

    if (checkFollowUser) {
      await User.findByIdAndUpdate(user._id, {
        $pull: { followers: req.user.id },
      });
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { following: user._id },
      });

      const updateFollowers = user.followers.filter(
        (id) => id.toString() !== req.user.id
      );
      const updateFollowing = currentUser.following.filter(
        (id) => id.toString() !== user._id
      );
      user.followers = updateFollowers;
      currentUser.following = updateFollowing;
      res.status(200).json({ success: true, user, currentUser });
    } else {
      await User.updateOne(
        { _id: user._id },
        { $push: { followers: req.user.id } }
      );
      await User.updateOne(
        { _id: req.user.id },
        { $push: { following: user._id } }
      );

      const newnotification = new Notification({
        type: "follow",
        from: req.user.id,
        to: user._id,
      });
      await newnotification.save();

      const postOnerSocketId = reciversocketid(user._id);

      if (postOnerSocketId) {
        io.to(postOnerSocketId).emit("notification", newnotification);
      }

      user.followers.push(req.user.id);
      currentUser.following.push(user._id);
      res.status(200).json({ success: true, user, currentUser });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSearchUser = async (req, res) => {
  try {
    if (!req.query.searchTerm) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    const searchUser = await User.find({
      username: { $regex: req.query.searchTerm, $options: "i" },
    }).select("-password");

    // if (searchUser.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ success: false, searchUser, message: "user not found" });
    // }

    res.status(200).json({ success: true, searchUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getfollowedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    let followedUsers = await User.find({
      ...(req.query.userId && { _id: { $in: user.followers } }),
      ...(req.query.searchTerm && {
        $or: [
          { fullname: { $regex: req.query.searchTerm, $options: "i" } },
          { username: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }).select("-password");

    res.status(200).json({ success: true, followedUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getfollowingUsers = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }
    let followingUsers = await User.find({
      ...(req.query.userId && { _id: { $in: user.following } }),
      ...(req.query.searchTerm && {
        $or: [
          { fullname: { $regex: req.query.searchTerm, $options: "i" } },
          { username: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    }).select("-password");

    res.status(200).json({ success: true, followingUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullname, bio, gender } = req.body;
    const image = req.file;
    const userId = req.user.id;

    const user = await User.findById(userId);

    let response;
    if (image) {
      if (user.profilePicture) {
        const imgId = user.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      }
    }
    if (image) {
      response = await uploadOnCloudinary(image?.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullname,
          bio,
          gender,
          profilePicture: response,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suggestedUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userfollowedbyme = await User.findById(userId).select("following");
    const users = await User.find({_id:{$ne:userId}});

    const filterdusers = users.filter(
      (user) => !userfollowedbyme.following.includes(user._id)
    );
    const suggesteduser = filterdusers.slice(0, 4);
    suggesteduser.forEach((user) => (user.password = null));
    res.status(200).json({success:true, suggesteduser});
  } catch (error) {res.status(500).json({ success: false, message: error.message });}
};
