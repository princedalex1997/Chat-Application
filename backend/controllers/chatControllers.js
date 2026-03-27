import asyncHandler from "express-async-handler";
import Chat from "../models/ChatModel.js";
import User from "../models/UserModels.js";

//Access Chat List In One By One
//URL : POST (http://localhost:5000/chats)
export const accessChat = asyncHandler(async (req, res) => {
  // if(!req.body || !req.body.loggedInUserId){
  //     return res.status(400).json({ message: "loggedInUserId is required" });
  // }
  const loggedInUserId = req.user._id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  //   if (!userId) {
  //     console.log("Error to access user id");
  //     return res.sendStatus(400);
  //   }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: loggedInUserId } },
      },
      {
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var ChatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [loggedInUserId, userId],
    };
  }

  try {
    const createChat = await Chat.create(ChatData);
    const FullChat = await Chat.find({ _id: createChat._id }).populate(
      "users",
      "-password",
    );
    res.status(200).json(FullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//Fn For Get All The Chats
//URL : GET (http://localhost:5000/chats)
export const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).json(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create a Group for Chats
//URL : http://localhost:5000/chats/group
export const createGroupChat = asyncHandler(async (req, res) => {
  // group name
  // users

  if (!req.body.name || !req.body.users) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.users);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const renameGroup = asyncHandler(async (req, res) => {});
export const removeFromGroup = asyncHandler(async (req, res) => {});
export const addToGroup = asyncHandler(async (req, res) => {});
