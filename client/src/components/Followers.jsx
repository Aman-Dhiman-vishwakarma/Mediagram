import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io';
import { Link, useParams } from "react-router-dom";

const Followers = () => {
  const {userId} = useParams();
  const [followers, setFollowers] = useState([]);
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false);

  const searchFollowUser = async () => {
    try { 
      setLoading(true)
      const res = await axios.get(`/api/user/getfolloweduser?userId=${userId}&searchTerm=${inputValue}`)
      if (res?.data?.success) {
       setFollowers(res?.data?.followedUsers)
       setLoading(false)
     }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  
  }
  
  useEffect(()=>{
    const timer = setTimeout(()=>{
       searchFollowUser();
      
    }, inputValue === "" ? 0 : 200)

    return () => {
      clearTimeout(timer)
    }

  },[userId, inputValue])

  // useEffect(()=>{
  //    const getuserfollowers = async () => {
  //       try {
  //         setLoading(true)
  //         const res = await axios.get(`/api/user/getfolloweduser?userId=${userId}`)
  //         if (res?.data?.success) {
  //           setFollowers(res?.data?.followedUsers)
  //           setLoading(false)
  //         }
  //       } catch (error) {
  //         console.log(error)
  //         setLoading(false)
  //       }
  //    }
  //    getuserfollowers();
  // },[userId])


  return (
    <div className="max-w-xl mx-auto my-4">
      <div className="flex items-center">
        <IoIosSearch size="40px" className="bg-gray-100 p-2 rounded-l-lg" />
        <input
          type="text"
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="Search for user..."
          className="p-2 my-2 rounded-r-lg w-full outline-none bg-gray-100"
        />
      </div>
    <div className="flex items-center justify-between mt-4 text-sm">
      <h1 className="font-semibold text-gray-800 text-base">All Followers</h1>
      
    </div>
    {!loading ? (followers?.length !== 0 ? followers?.map((user, index) => {
      return (
        <div key={index} className="flex items-center justify-between my-5 px-1">
          <div className="flex items-center gap-4">
            <div className="avatar mt-1">
              <div className="w-12 border rounded-full">
                <img src={user?.profilePicture} />
              </div>
            </div>
            <div>
              <h1 className="font-semibold text-sm">
                {user?.username}
              </h1>
              <span className="text-gray-500 text-sm font-semibold">
              {user?.fullname}
              </span>
            </div>
          </div>
          <span className="text-xs py-1 px-4 rounded font-bold bg-gray-100 cursor-pointer hover:text-[#3495d6]">
            Remove
          </span>
        </div>
      );
    }) : <div className='mt-20 text-center font-semibold' >User Not Found</div>) : <div className='mt-20 flex items-center justify-center gap-2 font-semibold'><span className="loading loading-spinner loading-sm"></span> Loading...</div>}
  </div>
  )
}

export default Followers
