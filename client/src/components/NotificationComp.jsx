import React, { useEffect, useState } from "react";
import axios from "axios"
import { useDispatch } from "react-redux";
import { setNullrRtmNotification } from "../redux/notificationSlice";

const NotificationComp = () => {
  
    const [notification, setNotification] = useState([])
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const dispatch = useDispatch()

    useEffect(()=>{
        const getNotifications = async () => {
          try {
            setLoading(true)
            const res = await axios.get("/api/notification/getnotifications") 
            if (res?.data?.success) { 
                setLoading(false)
                setNotification(res?.data?.notifications)
                dispatch(setNullrRtmNotification()) 
            }
          } catch (error) {
            setLoading(false)
            console.log(error.response.data.message)
          }
        }
        getNotifications()
    }, [])

    const handleDelete = async (id) => {
      try {
        setDeleteLoading(true)
        const res = await axios.delete(`/api/notification/deletenotification/${id}`) 
        if (res?.data?.success) { 
          const notificationsfind = notification.filter((item)=>item._id !== res?.data?.deleteNotification._id)
          setNotification(notificationsfind)
          setDeleteLoading(false)
      }
      } catch (error) {
        setDeleteLoading(false)
        console.log(error.response.data.message)
      }
    }
  return (
    <div className="h-full">
      <div className="max-w-xl flex flex-col mx-auto h-full">
        <div className="p-2 font-semibold text-xl mt-5">Notifications</div>
        <div className="flex-1 overflow-y-auto px-2 no-scrollbar">
          {!loading ? notification?.length !== 0 ? notification?.map((usernotification, index) => (
            <div key={index} className="flex items-center justify-between my-5">
              <div className="flex items-center gap-2">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img src={usernotification?.from?.profilePicture} />
                  </div>
                </div>
                <div>
                  <h1 className="font-semibold text-sm">{usernotification?.from?.fullname}</h1>
                  <span className="text-gray-600 text-sm font-semibold">{usernotification?.type === "like" ? "Like your post" : "Started following you"}</span>
                </div>
              </div>
              <span onClick={()=>{handleDelete(usernotification?._id)}} className="text-xs py-1 px-2 rounded font-bold bg-gradient-to-r from-blue-200 via-blue-100 to-red-100 cursor-pointer hover:text-[#3495d6]">
               {!deleteLoading ? "Delete" : "Loadind..."}
              </span>
            </div>
          )) : <div className="text-center font-semibold mt-20">You have not any notification </div> : <div className="flex items-center justify-center gap-2 mt-20"><span className="loading loading-spinner loading-sm"></span> Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default NotificationComp;
