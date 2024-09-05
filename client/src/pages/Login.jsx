import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../redux/authSlice";

const Login = () => {
  const { currentUser } = useSelector((store) => store.auth);
  const [input, setinput] = useState({
    username: "",
    password: "",
  });
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const neviget = useNavigate()
  const dispatch = useDispatch();

  const onInputChange = (e) => {
    setinput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.username === "" || input.password === "") {
      return;
    }
    try {
      setloading(true);
      const res = await axios.post("/api/auth/login", input, {
        headers: { "Content-Type": "application/json" },
      });
      if (res?.data?.success) {
        setloading(false);
        dispatch(setCurrentUser(res?.data?.user))
        neviget("/")
      }
    } catch (error) {
      seterror(error.response.data.message)
      setloading(false);
    }
  };

  useEffect(()=>{
    if (currentUser) {
      neviget("/")
    }
  }, [])

  return (
    <div className="">
      <div className="max-w-5xl mx-auto mt-28 flex md:flex-row flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="">
            <h1 className="my-2 font-bold text-4xl md:text-6xl">
              <span className="bg-gradient-to-r from-blue-700 to-red-600 rounded-md text-transparent bg-clip-text">
                Mediagram
              </span>
            </h1>
            <p className="text-sm md:text-base">
              Hear you can signIp with your email and make friends on{" "}
              <span className="font-semibold">MediaGram</span>
            </p>
          </div>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
            <div className="flex flex-col">
              <label name="Username">Username</label>
              <input
                type="text"
                value={input.username}
                name="username"
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
              Don't have an account?
              <Link to="/signup" className="text-blue-500">
                SignUp
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

export default Login;
