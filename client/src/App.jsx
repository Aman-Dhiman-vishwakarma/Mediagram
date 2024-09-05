import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import Home from "./components/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Feed from "./components/Feed";
import CreatePost from "./components/CreatePost";
import Profile from "./components/Profile";
import SearchPage from "./components/SearchPage";
import ExplorePage from "./components/ExplorePage";
import Followers from "./components/Followers";
import Following from "./components/Following";
import EditProfile from "./components/EditProfile";
import MessageComp from "./components/MessageComp";
import ChatUsers from "./components/ChatUsers";
import ChatPage from "./components/ChatPage";
import {io} from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import NotificationComp from "./components/NotificationComp";
import { setrRtmNotification } from "./redux/notificationSlice";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/feed",
          element: <Feed />,
        },
        {
          path: "/createpost",
          element: <CreatePost />,
        },
        {
          path: "/profile/:userId",
          element: <Profile />,
        },
        {
          path: "/explore",
          element: <ExplorePage />
        },
        {
          path: "searchpage",
          element: <SearchPage />
        },
        {
          path: "/notificationcomp",
          element: <NotificationComp />
        },
        {
          path:"/followers/:userId",
          element:<Followers />
        },
        {
          path:"/following/:userId",
          element:<Following />
        },
        {
          path:"/editprofile/:userId",
          element:<EditProfile />
        },
        {
          path:"/messagecomp",
          element:<MessageComp />,
          children:[
            {
              path:"/messagecomp",
              element:<ChatUsers />
            },
            {
              path:"/messagecomp/chatpage/:reciverId",
              element:<ChatPage />
            }
          ]
        },
      ],
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
const dispatch = useDispatch();
  const {currentUser} = useSelector((store)=>store.auth)
  const {socket} = useSelector((store)=>store.socket)
  useEffect(()=>{
    if (currentUser) {
      const socketio = io("http://localhost:8000", {
        query:{
          userId:currentUser?._id
        },
        transports:["websocket"]
      })
      dispatch(setSocket(socketio))

      socketio.on("getOnlineUsers", (onlineusers)=>{
         dispatch(setOnlineUsers(onlineusers))
      })
      socketio.on("notification", (notification)=>{
        dispatch(setrRtmNotification(notification))
      })

      return ()=>{
        socketio.close();
        dispatch(setSocket(null))
      }
    }else{
      socket?.close();
      dispatch(setSocket(null))
    }

   
  }, [currentUser])

  return (
    <div className="h-screen no-scrollbar">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;

