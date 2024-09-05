import React from "react";
import { Outlet } from "react-router-dom";

const MessageComp = () => {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  );
};

export default MessageComp;
