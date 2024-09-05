import React from "react";


const Comment = ({comment}) => {
 
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img src={comment?.user?.profilePicture} />
          </div>
        </div>
        <div className="">
        <h1 className="font-bold text-sm">
         {comment?.user?.username}{" "}
         
        </h1>
        <p className="text-gray-600 font-semibold text-sm">{comment?.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
