import React, { useEffect, useState } from "react";
import Stories from "./Stories";
import Feed from "./Feed";
import MbTopbaar from "./MbTopbaar";
import { useDispatch, useSelector } from "react-redux";


const Home = () => {
  const dispatch = useDispatch();

  

  return (
    <div id="scrollableDiv">
        <div className="md:hidden">
          <MbTopbaar />
        </div>
        <div className="">
          {/* <div className="flex items-center gap-2 border-b">
            <div className=" flex items-center justify-center md:h-28 h-16 md:min-w-28 min-w-16">
              <div className="avatar">
                <div className="ring-primary ring-offset-base-100 md:w-20 w-14 rounded-full ring ring-offset-2">
                  <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
              </div>
            </div>
            <Stories />
          </div> */}
          <Feed />
        </div>
     
    </div>
  );
};

export default Home;
