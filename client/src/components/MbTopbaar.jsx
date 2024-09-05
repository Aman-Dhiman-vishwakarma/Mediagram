import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const MbTopbaar = () => {
  const { rtmNotification } = useSelector((store) => store.notification);
  return (
    <div className="flex items-center justify-between pl-2 pr-4 py-2">
      <h1 className="font-bold text-2xl">
        <span className="bg-gradient-to-r from-blue-700 to-red-600 rounded-md text-transparent bg-clip-text">
          Mediagram
        </span>
      </h1>
      <div className="flex items-center gap-8">
        <Link to="/notificationcomp" className="mt-2">
          {" "}
          <div className="indicator">
            {rtmNotification?.length !== 0 && (
              <span className="indicator-item flex items-center justify-center h-5 w-5 p-[4px] text-xs bg-red-600 rounded-full text-white">
               {rtmNotification?.length}
              </span>
            )}
            
              <FaRegHeart size="20px" />
          </div>
        </Link>
        <Link to="/messagecomp">
          <AiOutlineMessage size="22px" />
        </Link>
      </div>
    </div>
  );
};

export default MbTopbaar;
