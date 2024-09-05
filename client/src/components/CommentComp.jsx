import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { setAllComments, setComments } from "../redux/commentSlice";

const CommentComp = ({ postId, username }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { comments, commentPostId } = useSelector((store) => store.comment);
  const [text, settext] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const { currentUser } = useSelector((store) => store.auth);

  useEffect(() => {
    const getcomments = async () => {
      try {
        setCommentLoading(true);
        const res = await axios.get(
          `/api/comment/getcomments/${commentPostId}`
        );
        if (res?.data?.success) {
          dispatch(setAllComments(res?.data?.comments));

          setCommentLoading(false);
        }
      } catch (error) {
        console.log(error.response.data.message);
        dispatch(setAllComments([]));
        setCommentLoading(false);
      }
    };
    if (commentPostId) {
      getcomments();
    }
  }, [commentPostId]);

  const postComment = async () => {
    try {
      if (text === "") {
        return;
      }
      setLoading(true);
      const res = await axios.post(
        `/api/comment/postcomment/${postId}`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res?.data?.success) {
        dispatch(setComments(res?.data?.newComment));

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      settext("");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="h-96 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        {!commentLoading ? (
          comments.length !== 0 ? (
            comments.map((comment, index) => (
              <Comment comment={comment} key={index} />
            ))
          ) : (
            <span className="text-center mt-9 font-semibold">
              No comments found{" "}
            </span>
          )
        ) : (
          <span className="text-center mt-9 font-semibold">Loading...</span>
        )}
      </div>
      <div className="flex items-center px-2 border border-gray-200 py-2">
        <div className="avatar">
          <div className="w-6 rounded-full">
            <img src={currentUser?.profilePicture} />
          </div>
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => {
            settext(e.target.value);
          }}
          className="w-full outline-none p-2"
          placeholder={`Add a comment for ${username}...`}
        />
        <button
          className="px-4 font-semibold bg-gray-100 rounded-md py-1"
          onClick={postComment}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentComp;
