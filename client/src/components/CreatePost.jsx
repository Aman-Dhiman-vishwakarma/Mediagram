import React, { useRef, useState } from "react";
import axios from "axios";
import { FcImageFile } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import MbTopbaar from "./MbTopbaar";

const CreatePost = () => {
  const [file, setfile] = useState(null);
  const [caption, setcaption] = useState("");
  const [fileToShow, setFileToShow] = useState(null);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const neviget = useNavigate();

  const handlefile = (e) => {
    const files = e.target.files[0];
    setFileToShow(URL.createObjectURL(files));
    setfile(files);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    if(!file) return;
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);
    try {
      setLoading(true);
      seterror(null)
      const res = await axios.post("/api/post/createpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setLoading(false);
        neviget("/")
      }
    } catch (error) {
      seterror(error.response.data.message)
      setLoading(false);
    }
  };
  return (
    <>
    <div className="md:hidden"><MbTopbaar /></div>
    <div className="w-full">
      <form
        onSubmit={handlesubmit}
        className="shadow-md w-full md:max-w-2xl mx-auto flex flex-col gap-4 p-4 mt-4 rounded"
      >
        <h1 className="text-center text-xl font-semibold">Create Post</h1>
        <textarea
          onChange={(e) => {
            setcaption(e.target.value);
          }}
          rows="3"
          placeholder="Write somthing here..."
          className="border border-gray-400 outline-none rounded pl-2 pt-2"
        />
        {fileToShow && (
          <div className="w-full h-72 md:h-96 rounded">
            <img
              src={fileToShow}
              className="w-full h-full object-cover rounded"
            />
          </div>
        )}
        <button
          onClick={() => {
            imageRef.current.click();
          }}
          type="button"
          className="bg-gradient-to-r from-blue-100 via-blue-100 to-red-100 flex items-center max-w-36 gap-2 p-2 rounded-md font-semibold"
        >
          <FcImageFile size="24px" />
          Select Image
        </button>
        <input type="file" ref={imageRef} onChange={handlefile} hidden />
        {!loading ? (
          <button
            className="bg-gradient-to-r from-blue-100 via-blue-100 to-red-100 rounded p-2 font-semibold border border-gray-300"
            type="submit"
          >
            Post
          </button>
        ) : (
          <button
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-100 via-blue-100 to-red-100 rounded p-2 font-semibold border border-gray-300"
            type="submit"
          >
            {" "}
            <span className="loading loading-spinner loading-sm"></span>{" "}
            Loading...
          </button>
        )}
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
      </form>
      <div className="flex flex-col items-center justify-center mt-5 w-full md:max-w-2xl mx-auto p-5 shadow-md">
        <h1 className="text-xl font-semibold">Create a Post</h1>
        <h1 className="text-xl font-semibold">With</h1>
        <h1 className="my-2 md:text-5xl font-bold text-3xl">
          <span className="bg-gradient-to-r from-blue-700 to-red-600 px-2 rounded-md text-transparent bg-clip-text">
            Mediagram
          </span>
        </h1>
      </div>
    </div>
    </>
  );
};

export default CreatePost;
