import generateToken from "../config/generateToken.js";
import User from "../models/UserModels.js";
import asyncHandler from "express-async-handler";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter the fields");
  }
  const userEmailExist = await User.findOne({ email });
  if (userEmailExist) {
    res.status(400);
    throw new Error("User already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  const tokens = await generateToken(user._id);
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      tokens,
    });
  } else {
    res.status(400);
    throw new Error("User Not added");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // 🔴 Check user AND password
  if (user && (await user.matchPassword(password))) {
    const token = await generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//http://localhost:5000/user/userlist?search=p   &&  //we will get prince & priya
export const allUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find({
    ...keywords,
    _id: { $ne: req.user._id },
  });
  res.status(200).json(users);
});
