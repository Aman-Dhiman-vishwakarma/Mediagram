import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setMessage } from "../redux/messageSlice";
import useGetRTM from "../hooks/useGetRTM";

const ChatPage = () => {
  useGetRTM();
  const {reciverId} = useParams();
  const dispatch = useDispatch();
  const {messages, selectedMessageUser} = useSelector((store)=>store.message)
  const {currentUser} = useSelector((store)=>store.auth)
  const {onlineUsers} = useSelector((store)=>store.chat)
  const [loading, setLoading] = useState(false);
  const [messageText, setMessageText] = useState("")
  const scroll = useRef();

  
  useEffect(()=>{
    const getUserMessages = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/message/getmessage/${reciverId}`)
      if (res?.data?.success) {
        setLoading(false)
        dispatch(setMessage(res?.data?.messages))
      }
    } catch (error) {
      setLoading(false)
      console.log(error.response.data.message)
    }
    }
    getUserMessages();

    return ()=>{
      dispatch(setMessage(null))
    }
  }, [reciverId])

 const sendMessage = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`/api/message/sendmessage/${selectedMessageUser?._id}`, {messageText}, {
      headers:{"Content-Type":"application/json"}
    })

    if (res?.data?.success) {
      console.log(res?.data)
      dispatch(setMessage([...messages, res?.data?.newMessage]))
      setMessageText("")
    }
  } catch (error) {
    console.log(error.response.data.message)
  }
  console.log(messageText)
 }

 useEffect(()=>{
  scroll.current?.scrollIntoView({behavior:"smooth"})
}, [messages])

  return (
    <div className="h-full">
      <div className="max-w-xl mx-auto flex flex-col h-full py-2">
        <div className="h-14 shadow-md flex items-center">
          <Link
            to={`/profile/${selectedMessageUser?._id}`}
            className="flex items-center hover:bg-gray-100 justify-between my-5"
          >
            <div className="flex items-center ml-2 gap-2">
              <div className={`avatar ${onlineUsers?.includes(selectedMessageUser?._id) && "online"}`}>
                <div className="w-11 rounded-full">
                  <img src={selectedMessageUser?.profilePicture} />
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-sm">{selectedMessageUser?.fullname}</h1>
                <span className="text-gray-600 text-sm">{selectedMessageUser?.username}</span>
              </div>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {!loading ? (messages ? messages?.map((item, index) => (
            <div ref={scroll} key={index} className={`flex py-1 px-1 font-semibold ${currentUser?._id === item?.senderId ? "justify-end" : "justify-start"}`}><span className={`py-1 px-2 ${currentUser?._id === item?.senderId ? "bg-purple-600 text-white" : "bg-gray-200"} rounded-md`}>{item?.message}</span></div>
          )) : <div className="flex items-center justify-center gap-2 mt-20">Messages not found</div>) : <div className="flex items-center justify-center gap-2 mt-20"><span className="loading loading-spinner loading-sm"></span> Loading...</div>
        }
        </div>
        <div className="h-16">
            <form onSubmit={sendMessage} className="flex gap-2">
            <input value={messageText} onChange={(e)=>{setMessageText(e.target.value)}} type="text" className="p-2 rounded-md outline-none bg-gray-100 border border-gray-500 w-full" />
            <button type="submit" className="px-4 py-1 rounded-md border border-gray-500 bg-gray-100"><IoSend className="text-purple-700" size="30px" />
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
