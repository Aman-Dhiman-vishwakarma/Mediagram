import React, { useEffect, useState } from "react";
import Sidebaar from "../components/Sidebaar";
import SuggestedUsers from "../components/SuggestedUsers";
import { Outlet, useLocation } from "react-router-dom";
import MbBotombaar from "../components/MbBotombaar";
import { useDispatch, useSelector } from "react-redux";
import CommentComp from "../components/CommentComp";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { setMorePosts } from "../redux/postSlice";

const MainLayout = () => {
  const { toggleCommentComp } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const location = useLocation().pathname;
  const [hasmore, sethasmore] = useState(true);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    sethasmore(true);
  }, [location]);

  const fetchMorePosts = async () => {
    try {
      sethasmore(true);
      setLoading(true)
      const res = await axios.get(
        `/api/post/getposts?startIndex=${posts?.length}`
      );
      if (res?.data?.success) {
        
        dispatch(setMorePosts(res?.data?.posts));
      }
      if (res?.data?.posts?.length === 0) {
        sethasmore(false);
      }
    } catch (error) {
      console.log(error?.response?.data);
      if (!error?.response?.data?.success) {
        sethasmore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      <div className="hidden md:block">
        <Sidebaar />
      </div>
      {/* <div className="md:hidden"><MbTopbaar /></div> */}
      <div
        id="scrollableDiv"
        className="flex-1 overflow-y-scroll pl-1 pr-1 no-scrollbar"
      >
        {location === "/" ? (
          <InfiniteScroll
            dataLength={posts && posts?.length}
            next={fetchMorePosts}
            hasMore={hasmore}
            loader={loading &&
              <h4 className="flex justify-center items-center gap-2 p-2 my-2">
                <span className="loading loading-spinner loading-sm"></span>{" "}
                Loading...
              </h4>
            }
            scrollableTarget="scrollableDiv"
            endMessage={
              <p className="text-center p-2 my-4 font-semibold border-t">
                Yay! You have seen it all
              </p>
            }
          >
            <Outlet />
          </InfiniteScroll>
        ) : (
          <Outlet />
        )}
      </div>
      <div className="md:hidden">
        <MbBotombaar />
      </div>
     <div className={`hidden lg:block`}>
        <SuggestedUsers />
      </div>
          
      {/* <div
        className={`h-[100%] px-2 w-[100%] flex justify-center items-end bg-gray-500 bg-opacity-60 absolute z-50 ${
          toggleCommentComp ? "bottom-0" : "bottom-[-100%]"
        } transition-all duration-200`}
      >
        <div className=" bg-gray-100 h-[80%] w-full lg:w-[40%] md:w-[60%]">
          <CommentComp />
        </div>
      </div> */}
    </div>
  );
};

export default MainLayout;
