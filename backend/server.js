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

const io = new Server(server,{
  pingTimeout: 60000,
  cors:{
    origin:"http://localhost:5173"
  }
})
io.on("connection",(socket)=>{
  console.log("Connected to socket.io");
  
})
