import React from "react";
import { MdOutlineHome } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FaRegSquarePlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MbBotombaar = () => {
  const { currentUser } = useSelector((store) => store.auth);

  const botomNevigation = [
    { icon: <MdOutlineHome size="26px" />, link: "/" },
    { icon: <IoIosSearch size="28px" />, link: "/explore" },
    { icon: <FaRegSquarePlus size="22px" />, link: "/createpost" },

    {
      icon: (
        <div className="avatar mt-2">
          <div className="w-7 border rounded-full">
            <img src={currentUser?.profilePicture} />
          </div>
        </div>
      ),
      link: `/profile/${currentUser?._id}`,
    },
  ];
  return (
    <div className="flex justify-between items-center p-6 py-2">
      {botomNevigation.map((item, index) => (
        <Link to={item.link} key={index}>
          <button>{item.icon}</button>
        </Link>
      ))}
    </div>
  );
};

export default MbBotombaar;
