import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import userRoutes from "./route/userRoutes.js";
import  chatRoutes  from "./route/chatRoutes.js";
import  messageRoute  from "./route/messageRoutes.js";
import "./models/ChatModel.js"
import "./models/MessageModel.js"
import "./models/UserModels.js"
import colors from "colors"

import mongoose from "mongoose";


// console.log(mongoose.modelNames());

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config({ quiet: true });

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

// console.log("DB:", process.env.MONGO_URI);
// console.log("show :" , mongoose.connection.name);


app.use("/user", userRoutes);
app.use("/chats", chatRoutes)
app.use("/message", messageRoute)
// app.get("/api/data",(req,res)=>{
//     // const single = data.find((c)=>c._id ===req.params.id)
//     res.send(data)
// })
