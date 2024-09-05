import React from "react";
import { useNavigate } from "react-router-dom";
import Explore from "./Explore";
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";

const ExplorePage = () => {
  const neviget = useNavigate();
  const { posts } = useSelector((store) => store.post);
  return (
    <div className="max-w-xl mt-2 mx-auto">
      <button
        type="button"
        onClick={() => {
          neviget("/searchpage");
        }}
        className="flex items-center gap-2 p-2 my-2  text-start rounded-lg w-full bg-gray-50 border border-gray-200"
      >
        <IoIosSearch size="24px"/> Search users...
      </button>
   <Explore posts={posts} />
     
      
    </div>
  );
};

export default ExplorePage;
