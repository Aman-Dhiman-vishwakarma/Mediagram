import axios from "axios";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/authSlice";

const EditProfile = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const fileRef = useRef();
  const [fileToShow, setFileToShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
    gender: currentUser?.gender || "",
    file: currentUser?.profilePicture || "",
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onfilechange = (e) => {
    const file = e.target.files[0];
    setFileToShow(URL.createObjectURL(file));
    setInput({ ...input, file: file });
  };

  const handleGenderChange = (e) => {
    setInput({ ...input, gender: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/user/updateuser", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res?.data?.success) {
        dispatch(setCurrentUser(res?.data?.updatedUser));
        setLoading(false);
      }
    } catch (error) {
      setError(error.response.data.message)
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 border shadow-md py-4 px-1">
      <h1 className="text-center mb-6 text-xl font-semibold">Edit Profile</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto md:grid md:grid-cols-2 w-full gap-4 flex flex-col justify-center items-center"
      >
        <div className="flex items-center gap-4 col-span-2 md:mb-4">
          <input type="file" onChange={onfilechange} ref={fileRef} hidden />
          {(fileToShow || currentUser?.profilePicture) && (
            <img
              src={fileToShow || currentUser?.profilePicture}
              className="w-16 h-16 rounded-full"
            />
          )}
          <span
            onClick={() => {
              fileRef.current.click();
            }}
            className="bg-gray-100 rounded-md p-2 font-semibold cursor-pointer"
          >
            Select and Add your Profile Photo
          </span>
        </div>
        <input
          type="text"
          name="fullname"
          value={input.fullname}
          onChange={handleInputChange}
          placeholder="Fullname"
          className="p-2 rounded-md border-b outline-none border-gray-800 w-[90%]"
        />
        <input
          type="text"
          name="bio"
          value={input.bio}
          onChange={handleInputChange}
          placeholder="Bio..."
          className="p-2 rounded-md border-b outline-none border-gray-800 w-full"
        />
        <div className="flex items-center gap-10 md:mt-4">
          <div className="flex items-center gap-2 font-semibold">
            Male
            <input
              type="radio"
              name="radio-1"
              value="male"
              className="radio"
              checked={input.gender === "male"}
              onChange={handleGenderChange}
            />
          </div>
          <div className="flex items-center gap-2 font-semibold">
            Female
            <input
              type="radio"
              name="radio-1"
              value="female"
              className="radio"
              checked={input.gender === "female"}
              onChange={handleGenderChange}
            />
          </div>
        </div>
        {!loading ? (
          <button
            className="mt-2 w-full col-span-2 border shadow-md p-2 font-semibold rounded-md"
            type="submit"
          >
            Edit & Save
          </button>
        ) : (
          <button
            className="mt-2 flex items-center justify-center gap-2 w-full col-span-2 border shadow-md p-2 font-semibold rounded-md"
            type="submit"
          >
            <span className="loading loading-spinner loading-sm"></span>{" "}
            Loading...
          </button>
        )}
      </form>
      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
