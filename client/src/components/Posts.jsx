import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";
import { useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const neviget = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasmore, sethasmore] = useState(true);


  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/post/getposts");
        if (res?.data?.success) {
          setLoading(false);
          dispatch(setPosts(res?.data?.posts));
        }
      } catch (error) {
        setLoading(false);
        console.log(error.response.data.message);
        if (error.response.data.message === "Unauthrized") {
          neviget("/login");
        }
      }
    };
    getPosts();
  }, []);

  // const fetchMorePosts = async () => {
  //   try {
  //     const res = await axios.get(
  //       `/api/post/getposts?startIndex=${posts?.length}`
  //     );
  //     if (res?.data?.success) {
  //       console.log(res?.data);
  //     }
  //   } catch (error) {
  //     console.log(error.response.data.message);
  //   }
  // };



  if (loading) {
    return (
      <div className="w-full flex mt-40 justify-center items-center gap-4">
        <span className="loading loading-spinner loading-sm"></span> Loading...
      </div>
    );
  }

  return (
   
       
    <div id="scrollableDiv" className="flex flex-col gap-2 ">
    
        {posts && posts?.map((post, index) => <Post key={index} post={post} />)}
        
        </div>
        
   
    
  );
};

export default Posts;
