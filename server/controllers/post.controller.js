import { Notification } from "../models/notification.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { io, reciversocketid } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const userId = req.user.id;

    if (!image.path) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const response = await uploadOnCloudinary(image.path);
    if (!response) {
      return res
        .status(400)
        .json({ success: false, message: "Somthing went wrong" });
    }

    const newPost = new Post({ caption, userId, image: response });
    await newPost.save();

    await newPost.populate({
      path: "userId",
      select: "-password",
    });

    res
      .status(200)
      .json({ success: true, newPost, message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const startIndex = req.query.startIndex || 0;
    const limit = req.query.limit || 5;
    // const currentUser = await User.findById(req.user.id);
    const posts = await Post.find()
      .populate({
        path: "userId",
        select: "-password",
      })
      .sort({ createdAt: 1 })
      .skip(startIndex)
      .limit(limit);

    // if (posts.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "there are no posts" });
    // }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userPosts = await Post.find({userId:req.params.userId})
    if (!userPosts) {
      return res
        .status(400)
        .json({ success: false, message: "There are no post" });
    }
    res.status(200).json({ success: true, userPosts });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "userId",
      select: "-password",
    });
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "post not found" });
    }

    const userLikePost = post.likes.includes(req.user.id);

    if (userLikePost) {
      await Post.updateOne(
        { _id: req.params.postId },
        { $pull: { likes: req.user.id } }
      );
      const updatesLikes = post.likes.filter(
        (like) => like.toString() !== req.user.id.toString()
      );

      post.likes = updatesLikes;
      res.status(200).json({ success: true, post });
    } else {
      post.likes.push(req.user.id);
      await post.save();

      if (post.userId._id.toString() !== req.user.id) {
        
        const notification = new Notification({
          from: req.user.id,
          to: post.userId._id,
          type: "like",
        });
        await notification.save();

        const postOnerSocketId = reciversocketid(post.userId._id)
        
        if (postOnerSocketId) {
          io.to(postOnerSocketId).emit("notification", notification)
        }
      }

      res.status(200).json({ success: true, post });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: false, message: "post not found" });
    }
    if (post.userId.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "you can't delete this post" });
    }
    if (post.image) {
      const imgId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    const deletPost = await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({
      success: true,
      deletedPost: deletPost,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
