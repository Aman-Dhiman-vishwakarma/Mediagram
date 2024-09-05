import React from "react";
import { MdOutlineHome } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { FaRegSquarePlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/authSlice";
import axios from "axios";

const Sidebaar = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const { rtmNotification } = useSelector((store) => store.notification);
  const dispatch = useDispatch();
  const neviget = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axios.get("/api/auth/signout");
      if (res?.data?.success) {
        dispatch(setCurrentUser(null));
        neviget("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sidebarItems = [
    { icon: <MdOutlineHome size="26px" />, text: "Home", link: "/" },
    { icon: <IoIosSearch size="28px" />, text: "Search", link: "/searchpage" },
    {
      icon: <FaArrowTrendUp size="24px" />,
      text: "Explore",
      link: "/explore",
    },
    {
      icon: <AiOutlineMessage size="26px" />,
      text: "Messages",
      link: "/messagecomp",
    },
    {
      icon: (
        <div className="indicator">
           {rtmNotification?.length !== 0 &&
          <span className="indicator-item flex items-center justify-center h-5 w-5 p-[4px] text-xs bg-red-600 rounded-full text-white">
           {rtmNotification?.length}
          </span>}
          <button className="">
            <FaRegHeart size="22px" />
          </button>
        </div>
      ),
      text: "Notifications",
      link: "/notificationcomp",
    },
    {
      icon: <FaRegSquarePlus size="22px" />,
      text: "Create",
      link: "/createpost",
    },
    {
      icon: (
        <div className="avatar">
          <div className="w-6 border rounded-full">
            <img src={currentUser?.profilePicture} />
          </div>
        </div>
      ),
      text: "Profile",
      link: `/profile/${currentUser?._id}`,
    },
    // { icon: <IoLogOutOutline size="26px" />, text: "Logout" },
  ];
  return (
    <>
      <div className="px-8 h-screen border-r w-64">
        <div className="flex h-full flex-col">
          <h1 className="my-8 pl-3 font-bold text-3xl cursor-pointer">
            <span className="bg-gradient-to-r from-blue-700 to-red-600 px-2 rounded-md text-transparent bg-clip-text">
              Mediagram
            </span>
          </h1>
          <div className="flex-1">
            {sidebarItems.map((item, index) => (
              <Link to={item.link} key={index}>
                <div className="flex items-center gap-4 py-3 px-4 hover:bg-gray-100 cursor-pointer text-base my-2 rounded font-semibold">
                  {item.icon} <span>{item.text}</span>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={handleLogOut}
            className="flex pl-3 mb-14 py-3 px-4 gap-4 bg-gradient-to-r from-blue-200 via-blue-100 to-red-100 rounded-md items-center font-bold"
          >
            <IoLogOutOutline size="26px" /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebaar;
