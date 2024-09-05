import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState();

  useEffect(()=>{
    const getsuggestedusers = async () => {
      try {
        const res = await axios.get("/api/user/suggestedusers")
        if (res?.data?.success) {
          setSuggestedUsers(res?.data?.suggesteduser)
        }
      } catch (error) {
        
      }
    }
    getsuggestedusers();
  }, [])
  return (
    <div className="my-8 mx-2 w-56 px-2 xl:w-96 lg:w-80 md:w-72 lg:px-4 border-l">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.length !== 0 ? suggestedUsers?.map((user, index) => {
        return (
          <div key={index} className="flex items-center justify-between my-5">
            <div className="flex items-center gap-2">
              <div className="avatar mt-2">
                <div className="w-10 border rounded-full">
                  <img src={user?.profilePicture} />
                </div>
              </div>
              <div>
                <h1 className="font-semibold text-sm">
                 {user?.fullname}
                </h1>
                <span className="text-gray-600 text-sm">
                 {user?.bio}
                </span>
              </div>
            </div>
            <Link to={`/profile/${user?._id}`} className="text-xs py-1 px-2 rounded font-bold bg-gradient-to-r from-blue-200 via-blue-100 to-red-100 cursor-pointer hover:text-[#3495d6]">
             Go To Profile
            </Link>
          </div>
        );
      }): <div>User not found</div>}
    </div>
  );
};

export default SuggestedUsers;
