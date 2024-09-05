import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setfindSearchUser } from "../redux/userSlice";
import { Link } from "react-router-dom";

const SearchPage = () => {
  const [inputValue, setInputValue] = useState("");
  const { findSearchUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [loading, setLoading] = useState(false);


  const searchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `api/user/getsearchuser?searchTerm=${inputValue}`
      );
      if (res?.data?.success) {
        setLoading(false);
        dispatch(setfindSearchUser(res?.data?.searchUser));
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchtimer = setTimeout(() => {
      if (inputValue !== "") {
        searchUser();
      }
    }, 200);

    return () => {
      clearTimeout(searchtimer);
     
    };
  }, [inputValue]);

  useEffect(() => {
    inputRef.current.focus();

    return  () => {
      dispatch(setfindSearchUser(null));
    }
  }, []);

  return (
    <div className="max-w-xl mt-2 mx-auto">
      <div className="flex items-center">
        <IoIosSearch size="40px" className="bg-gray-100 p-2 rounded-l-lg" />
        <input
          type="text"
          ref={inputRef}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Search for user..."
          className="p-2 my-2 rounded-r-lg w-full outline-none bg-gray-100"
        />
      </div>
      <div className="flex flex-col gap-4 mt-5">
        {!loading ? (
          findSearchUser?.length !== 0 ? (
            findSearchUser?.map((user, index) => (
              <Link
              to={`/profile/${user?._id}`}
                key={index}
                className="flex px-4 py-1 rounded items-center cursor-pointer hover:bg-gray-100 gap-4"
              >
                <div className="avatar">
                  <div className="w-12 border rounded-full">
                    <img src={user?.profilePicture} />
                  </div>
                </div>
                <div>
                  <h1 className="font-semibold text-base">{user?.username}</h1>
                  <span className="text-gray-600 text-sm line-clamp-1">
                    {user?.fullname}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="h-[50vh] flex items-center justify-center font-semibold">User not found</div>
          )
        ) : (
          <div className="h-[50vh] flex items-center justify-center">
            {" "}
            <span className="loading loading-spinner loading-sm"></span>{" "}
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
