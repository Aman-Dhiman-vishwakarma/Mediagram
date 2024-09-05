import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { PiHeartStraightFill } from "react-icons/pi";
import { AiOutlineMessage } from "react-icons/ai";
import { FaRegBookmark } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { setDeletePosts, setLikeUnlikePosts } from "../redux/postSlice";
import { setCommentPostId } from "../redux/commentSlice";
import CommentComp from "./CommentComp";
import { BsThreeDotsVertical } from "react-icons/bs";

const Post = ({ post }) => {
  const { currentUser } = useSelector((store) => store.auth);
  const [colorChange, setColorChange] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch();

  const likeUnlikePost = async () => {
    try {
      setColorChange(true)
      const res = await axios.get(`/api/post/likeunlikepost/${post?._id}`);
      if (res?.data?.success) {
        console.log(res?.data);
        setColorChange(false)
        dispatch(setLikeUnlikePosts(res?.data?.post));
      }
    } catch (error) {
      console.log(error.response.data);
      setColorChange(false)
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true)
      const res = await axios.delete(`/api/post/deletepost/${post?._id}`);
      if (res?.data?.success) {
        dispatch(setDeletePosts(res?.data?.deletedPost?._id));
        setDeleteLoading(false)
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      setDeleteLoading(false)
    }
  }

  return (
    <div className="my-4 md:my-4 w-full sm:max-w-md mx-auto">
      <div className="flex items-center justify-between">
      <Link to={`/profile/${post?.userId?._id}`}>
        <div className="flex items-center gap-2">
          
            <div className="avatar mt-2">
              <div className="w-10 border rounded-full">
                <img src={post?.userId?.profilePicture} />
              </div>
            </div>
          
          <div className="flex items-center font-semibold gap-3">
            <h1>{post?.userId?.fullname}</h1>
          </div>
          
        </div>
        </Link>
        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className=" m-1">
            {" "}
            <BsThreeDotsVertical size="22px" className="cursor-pointer" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content font-semibold menu bg-base-100 border rounded z-[1] w-32 px-4 py-2 shadow"
          >
            <li>
             {post?.userId?._id !== currentUser?._id ? "Report" : <button onClick={handleDelete} className=" ">{!deleteLoading ? "Delete" : "Loading..."}</button>}
            </li>
          </ul>
        </div>
      </div>
      <img
        className="rounded my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {post?.likes?.includes(currentUser?._id) || colorChange ? (
            <PiHeartStraightFill
              onClick={!colorChange && likeUnlikePost}
              size="24px"
              className="text-red-600 cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={likeUnlikePost}
              className="cursor-pointer"
              size="22px"
            />
          )}

          <AiOutlineMessage
            className="cursor-pointer"
            size="22px"
            onClick={() => {
              document.getElementById("comments_modal" + post?._id).showModal();
              dispatch(setCommentPostId(post?._id));
            }}
            // onClick={() => {
            //   dispatch(setToggleCommentComp(post?.userId?.username));
            //   dispatch(setCommentPostId(post?._id));
            // }}
          />
        </div>
        <div>
          <FaRegBookmark size="22px" />
        </div>
      </div>
      <span className="font-medium block mb-1">
        {post?.likes?.length > 1 ? <span>{post?.likes?.length} likes</span> : <span>{post?.likes?.length} like</span>} 
      </span>
      <p>
        <span className="font-medium mr-2">{post?.userId?.username}</span>
        {post?.caption}
      </p>

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id={`comments_modal${post?._id}`} className="modal">
        <div className="modal-box rounded">
          <h3 className="font-bold text-lg mb-2">Comments!</h3>
          <div className="flex flex-col gap-3">
            <CommentComp postId={post?._id} username={post?.userId?.username} />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Post;
