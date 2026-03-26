import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors"

const app = express();
dotenv.config({ quiet: true });

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

// app.get("/api/data",(req,res)=>{
//     // const single = data.find((c)=>c._id ===req.params.id)
//     res.send(data)
// })
