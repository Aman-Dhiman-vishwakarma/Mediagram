import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const SignUp = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const [input, setinput] = useState({
    fullname:"",
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const neviget = useNavigate()
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);

  const onInputChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setinput({ ...input, gender: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.username === "" || input.email === "" || input.password === "" || input.gender === "") {
      return;
    }
    try {
      setloading(true);
      seterror(null)
      const res = await axios.post("/api/auth/register", input, {
        headers:{"Content-Type":"application/json"}
      })
      if (res.data.success) {
        setloading(false);
        neviget('/login')
      }
    } catch (error) {
      setloading(false);
      seterror(error.response.data.message)
    }
  };

  useEffect(()=>{
    if (currentUser) {
      neviget("/")
    }
  }, [])

  return (
    <div>
      <div className="max-w-5xl mx-auto mt-28 flex md:flex-row flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="">
            <h1 className="my-2 font-bold text-4xl md:text-6xl">
              <span className="bg-gradient-to-r from-blue-700 to-red-600 rounded-md text-transparent bg-clip-text">
                Mediagram
              </span>
            </h1>
            <p className="text-sm md:text-base">
              Hear you can signUp with your email and make friends on{" "}
              <span className="font-semibold">MediaGram</span>
            </p>
            <p className="text-sm md:text-base">
              Hear you can follow unfollow users and create post and shere with
              your friends.
            </p>
          </div>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
          <div className="flex flex-col">
              <label name="Username">FullName</label>
              <input
                type="text"
                value={input.fullname}
                name="fullname"
                onChange={onInputChange}
                className="p-2 outline-none border border-gray-400 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label name="Username">Uesrname</label>
              <input
                type="text"
                value={input.username}
                name="username"
                onChange={onInputChange}
                className="p-2 outline-none border border-gray-400 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label name="Username">Email</label>
              <input
                type="email"
                value={input.email}
                name="email"
                onChange={onInputChange}
                className="p-2 outline-none border border-gray-400 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label name="Username">Password</label>
              <input
                type="password"
                value={input.password}
                name="password"
                onChange={onInputChange}
                className="p-2 outline-none border border-gray-400 rounded-md"
              />
            </div>
            <div className="flex items-center gap-10">
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
                type="submit"
                className="w-ful bg-gradient-to-r from-blue-700 to-red-600 p-2 rounded-md text-white"
              >
                SignIn
              </button>
            ) : (
              <button type="button" className="w-ful flex justify-center items-center gap-2 bg-gradient-to-r from-blue-700 to-red-600 p-2 rounded-md text-white">
                <span className="loading loading-spinner loading-sm"></span> Loading...
              </button>
            )}
            <div className="text-sm">
              Already have an account?
              <Link to="/login" className="text-blue-500">
                SignIn
              </Link>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default SignUp;
