import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMessageUser } from "../redux/messageSlice";

const ChatUsers = () => {
  const neviget = useNavigate();
  const [conversationUser, setConversationUser] = useState([]);
  const { onlineUsers } = useSelector((store) => store.chat);
  const { currentUser } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getConversationUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get("api/message/conversationusers");
        if (res?.data?.success) {
          setLoading(false);
          setConversationUser(res?.data?.frontusers);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.responce.data.message);
      }
    };
    getConversationUser();
  }, [currentUser]);

  return (
    <div className="h-full">
      <div className="max-w-xl mx-auto flex flex-col h-full">
        <div className="h-48 ">
          <div className=" py-2 px-2 text-lg font-semibold ">
            @{currentUser?.username}{" "}
          </div>
          <button
            type="button"
            onClick={() => {
              neviget("/searchpage");
            }}
            className="flex items-center gap-2 p-2 my-2  text-start rounded-lg w-full bg-gray-50 border border-gray-200"
          >
            <IoIosSearch size="24px" /> Search users...
          </button>
          <div className="flex p-1 gap-4">
            <div className="flex flex-col min-w-20 items-center">
              <div className="avatar online">
              <div className="md:w-16 w-14 border rounded-full">
              <img src={currentUser?.profilePicture} />
                </div>
              </div>
              <span className="text-xs text-center w-20 font-semibold line-clamp-1">
              {currentUser?.fullname}
              </span>
            </div>
            <div className="h-20 p-1 flex items-center gap-4 overflow-x-scroll no-scrollbar">
              {conversationUser?.map((user, index) => {
                const only = onlineUsers?.includes(
                  user?.participants?.[0]?._id
                );
                if (only) {
                  return (
                    <Link
                      onClick={() => {
                        dispatch(
                          setSelectedMessageUser(user?.participants?.[0])
                        );
                      }}
                      to={`/messagecomp/chatpage/${user?.participants?.[0]?._id}`}
                      key={index}
                      className="flex flex-col min-w-20 items-center"
                    >
                      <div className={`avatar ${only && "online"}`}>
                        <div className="md:w-16 w-14 rounded-full">
                          <img src={user?.participants?.[0]?.profilePicture} />
                        </div>
                      </div>
                      <span className="text-xs font-semibold line-clamp-1">
                        {user?.participants?.[0]?.fullname}
                      </span>
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="p-2 flex-1 overflow-y-scroll ">
          <h2 className="text-sm font-semibold mb-2">Messages</h2>
          {!loading ? (
            conversationUser?.length !== 0 ? (
              conversationUser?.map((user, index) => (
                <Link
                  onClick={() => {
                    dispatch(setSelectedMessageUser(user?.participants?.[0]));
                  }}
                  to={`/messagecomp/chatpage/${user?.participants?.[0]?._id}`}
                  key={index}
                  className="flex items-center hover:bg-gray-100 justify-between p-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`avatar ${
                        onlineUsers?.includes(user?.participants?.[0]?._id) &&
                        "online"
                      }`}
                    >
                      <div className="w-11 border rounded-full">
                        <img src={user?.participants?.[0]?.profilePicture}/>
                      </div>
                    </div>
                    <div>
                      <h1 className="font-semibold text-sm">
                        {user?.participants?.[0]?.fullname}
                      </h1>
                      <span className="text-gray-500 font-semibold text-sm line-clamp-1 w-48">
                        {user?.lastmessage?.text}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 font-semibold">
                    {new Date(
                      user?.lastmessage?.lastmessagedate
                    ).toLocaleDateString()}
                  </span>
                </Link>
              ))
            ) : (
              <div>Users not found</div>
            )
          ) : (
            <div className="flex items-center justify-center gap-2 mt-20">
              <span className="loading loading-spinner loading-sm"></span>{" "}
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatUsers;
