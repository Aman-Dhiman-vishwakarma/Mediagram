import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaThreads } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { LuUserPlus } from "react-icons/lu";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserPosts } from "../redux/userSlice";
import { setCurrentUser } from "../redux/authSlice";
import { setSelectedMessageUser } from "../redux/messageSlice";

const Options = ["POST", "SAVED"];

const Profile = () => {
  const { userId } = useParams();
  const [feedType, setFeedType] = useState("POST");
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [followloading, setfollowLoading] = useState(false);
  const { profileData, userPosts } = useSelector((store) => store.user);
  const { currentUser } = useSelector((store) => store.auth);
  const neviget = useNavigate();

  useEffect(() => {
    const getUserById = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/user/getuserbyid/${userId}`);
        if (res?.data?.success) {
          setLoading(false);
          dispatch(setProfileData(res?.data?.user));
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    getUserById();
  }, [userId]);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        setPostLoading(true);
        const res = await axios.get(
          `/api/post/getuserposts/${profileData?._id}`
        );
        if (res?.data?.success) {
          dispatch(setUserPosts(res?.data?.userPosts));
          setPostLoading(false);
        }
      } catch (error) {
        console.log(error);
        setPostLoading(false);
      }
    };
    if (profileData) {
      getUserPosts();
    }
  }, [profileData]);

  const followUnfollow = async () => {
    try {
      setfollowLoading(true);
      const res = await axios.get(
        `/api/user/followUnfollowUser/${profileData?._id}`
      );
      if (res?.data?.success) {
        dispatch(setCurrentUser(res?.data?.currentUser));
        dispatch(setProfileData(res?.data?.user));
        setfollowLoading(false);
      }
    } catch (error) {
      console.log(error);
      setfollowLoading(false);
    }
  };

  const handleFeed = (item) => {
    setFeedType(item);
    if (item === "POST") {
      setIndex(0);
    }
    if (item === "SAVED") {
      setIndex(100);
    }
  };

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

  if (loading) {
    return (
      <div className="w-full flex mt-40 justify-center items-center gap-4">
        <span className="loading loading-spinner loading-sm"></span> Loading...
      </div>
    );
  }

  return (
    <div className="w-full md:mt-4">
      <div className="md:hidden flex justify-between items-center max-w-xl pb-4 pt-2 px-2 mx-auto text-lg font-semibold ">
        {profileData?.username}{" "}
        <div className="flex items-center gap-5">
          <FaRegSquarePlus size="22px" />
          <FaThreads size="22px" />
          <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className=" m-1">
            {" "}
            <RxHamburgerMenu size="22px" className="cursor-pointer" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content font-semibold menu bg-base-100 border rounded z-[1] w-32 px-4 py-2 shadow"
          >
            <li onClick={handleLogOut} className="cursor-pointer">
             Logout
            </li>
          </ul>
        </div>
          
        </div>
      </div>
      <div className="grid grid-cols-4 grid-rows-2 max-w-xl mx-auto">
        <div className="avatar ml-2 lg:ml-6">
          <div className="w-24 border rounded-full">
            <img src={profileData?.profilePicture} />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <span className="font-semibold text-xl">{userPosts?.length}</span>
          Posts
        </div>

        <Link
          to={`/followers/${profileData?._id}`}
          className="flex flex-col items-center justify-center"
        >
          <span className="font-semibold text-xl">
            {profileData?.followers?.length}
          </span>
          Followers
        </Link>

        <Link
          to={`/following/${profileData?._id}`}
          className="flex flex-col items-center justify-center"
        >
          <span className="font-semibold text-xl">
            {profileData?.following?.length}
          </span>
          Following
        </Link>

        <div className="flex flex-col ml-3 col-span-2 lg:ml-6">
          <span className="font-semibold text-md">{profileData?.fullname}</span>
          <p className="text-sm text-wrap line-clamp-2">{profileData?.bio}</p>
        </div>
      </div>
      <div className="max-w-xl mx-auto flex justify-between items-center">
        {currentUser?._id === profileData?._id ? (
          <Link to={`/editprofile/${currentUser?._id}`}>
            <button className="bg-gray-100 px-6 py-2 font-semibold rounded-md">
              Edit Profile
            </button>{" "}
          </Link>
        ) : profileData?.followers?.includes(currentUser?._id) ? (
          <button
            onClick={followUnfollow}
            className="bg-gray-100 px-6 py-2 flex items-center gap-2 font-semibold rounded-md"
          >
            {followloading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}{" "}
            Following
          </button>
        ) : (
          <button
            onClick={followUnfollow}
            className="bg-gradient-to-r from-blue-200 via-blue-100 flex items-center gap-2 to-red-100  px-6 py-2 font-semibold rounded-md"
          >
            {followloading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}{" "}
            Follow
          </button>
        )}

        {currentUser?._id === profileData?._id ? (
          <Link to="/createpost">
            <button className="bg-gray-100 px-6 py-2 font-semibold rounded-md">
              Create
            </button>
          </Link>
        ) : (
          <Link
            to={`/messagecomp/chatpage/${profileData?._id}`}
            onClick={() => {
              dispatch(setSelectedMessageUser(profileData));
            }}
          >
            <button className="bg-gray-100 px-6 py-2 font-semibold rounded-md">
              Message
            </button>
          </Link>
        )}
        <button className="bg-gray-100 px-4 py-2 font-semibold rounded-md">
          <LuUserPlus size="24px" />
        </button>
      </div>
      <div className="max-w-xl mx-auto flex flex-col mt-9">
        <div className="relative flex justify-evenly items-center">
          {" "}
          {Options.map((item, index) => (
            <span
              key={index}
              onClick={() => {
                handleFeed(item);
              }}
              className={`px-4 py-2 font-semibold cursor-pointer ${
                feedType === item && "border-b-2 border-gray-600"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className=" overflow-hidden">
          <div
            className={`mt-5 ${
              index === 100 ? "translate-x-[-100%]" : "translate-x-0"
            } transition duration-500 flex`}
          >
            <div className="min-w-full  min-h-[50vh]">
              <div className="grid grid-cols-3 gap-2">
                {userPosts?.map((post, index) => (
                  <div key={index} className="md:h-44 h-32">
                    <img
                      src={post?.image}
                      alt="postImage"
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className=" min-w-full min-h-[50vh]">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 10 }).map((item, index) => (
                  <div key={index} className="md:h-44 h-32 bg-red-800">
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
