import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./route/userRoutes.js";
import chatRoutes from "./route/chatRoutes.js";
import messageRoute from "./route/messageRoutes.js";
import "./models/ChatModel.js";
import "./models/MessageModel.js";
import "./models/UserModels.js";
import { Server } from "socket.io";
import colors from "colors";

import mongoose from "mongoose";

// console.log(mongoose.modelNames());

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config({ quiet: true });

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/user", userRoutes);
app.use("/chats", chatRoutes);
app.use("/message", messageRoute);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  // Create  a Setup For If The User Is Loggied In
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  // create a room for messing users
  socket.on("join room", (roomId) => {
    socket.join(roomId);
    // console.log("room id is :" + roomId);
  });

  // check its typing or not! .
  socket.on("typing", (roomid) => socket.in(roomid).emit("typing"));
  socket.on("stop typing", (roomid) => socket.in(roomid).emit("stop typing"));

  socket.on("new message", (newMessageRecived) => {
    var chat = newMessageRecived.chat;
    if (!chat.users) return;

    chat.users.forEach((user) => {
      if (user._id === newMessageRecived.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecived);
    });
  });
});
