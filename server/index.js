import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.roure.js"
import postRoute from "./routes/post.route.js"
import userRoute from "./routes/user.route.js"
import commentRoute from "./routes/comment.route.js"
import messageRoute from "./routes/message.route.js"
import notificationRoute from "./routes/notification.route.js"
import {app, server} from "./socket/socket.js"
import path from "path";

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });


app.use("/api/auth", authRoute)
app.use("/api/post", postRoute)
app.use("/api/user", userRoute)
app.use("/api/comment", commentRoute)
app.use("/api/message", messageRoute)
app.use("/api/notification", notificationRoute)

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res)=>{
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
})


server.listen(8000, () => {
  console.log("server started");
});
