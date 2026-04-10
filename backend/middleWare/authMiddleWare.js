import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/UserModels.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  //   console.log("HEADERS:", req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const authHeader = req.headers.authorization.split(" ");
      token = authHeader[authHeader.length - 1];

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("DECODE:", decode);

      const user = await User.findById(decode.id);
      // console.log("USER:", user);

      req.user = user;
      next();
    } catch (error) {
      console.log("ERROR:", error.message); // 👈 THIS LINE IS KEY
      res.status(401);
      throw new Error("not authorization");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("not valid token");
  }
});
