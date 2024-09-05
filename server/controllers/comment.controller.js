import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";



export const createComment = async (req, res) => {
    try {
        const {text} = req.body;
        const post = await Post.findById(req.params.postId)

        if (!text || !post) {
            return res.status(400).json({ success: false, message: "Text is required" });
        }

        const newComment = new Comment({
            text:text,
            user:req.user.id,
            post:post._id
        })

        await newComment.save();

        await newComment.populate({
            path:'user',
            select:"username profilePicture"
        });

        res.status(200).json({ success: true, newComment, message:"new comment added" });
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getPostComment = async (req, res) => {
    try {
        const comments = await Comment.find({post: req.params.postId}).populate('user', 'username profilePicture')
        // if(comments.length === 0) return res.status(404).json({message:'No comments found for this post', success:false});
        res.status(200).json({success:true,comments});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const deletePostComment = async (req, res) => {
   try {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        return res
        .status(400)
        .json({ success: false, message: "comment not found" });
    }
    if (comment.user.toString() !== req.user.id.toString()) {
        return res
        .status(400)
        .json({ success: false, message: "you can't delete this comment" });
    }
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json({
        success: true,
        deletedComment,
        message: "Post deleted successfully",
      });
   } catch (error) {
    
   }
}

