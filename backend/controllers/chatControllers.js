import asyncHandler from "express-async-handler";
import Chat from "../models/ChatModel.js";
import User from "../models/UserModels.js";

//Access Chat List In One By One
//URL : POST (http://localhost:5000/chats)
export const accessChat = asyncHandler(async (req, res) => {
  const loggedInUserId = req.user._id;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
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
    return res.send(isChat[0]);
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
   Chat.find({
  users: req.user._id
})
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
        console.log("Result is , ", result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Create a Group for Chats
// URL : http://localhost:5000/chats/group
// {
//           name: groupChatName,
//           users: JSON.stringify(selectedUsers.map((u) => u._id)),
// },
export const createGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;

  // 🔴 Validation
  if (!name || !users) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  let parsedUsers;

  try {
    parsedUsers = JSON.parse(users);
  } catch (error) {
    return res.status(400).json({ message: "Invalid users format" });
  }

  if (parsedUsers.length < 2) {
    return res.status(400).json({
      message: "At least 2 users are required to form a group chat",
    });
  }

  // ✅ Always include current user
  parsedUsers.push(req.user._id);

  // ❗ Remove duplicates (important)
  const uniqueUsers = [...new Set(parsedUsers.map((id) => id.toString()))];

  try {
    // ✅ Create group chat (ONLY store ObjectIds)
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: uniqueUsers,
      groupAdmin: req.user._id, // ✅ FIXED
    });

    // ✅ Populate after creation
    const fullChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json(fullChat);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// TO RENAME THE GROUP
//PUT   (http://localhost:5000/chats/rename)
//  {
//           chatId: selectedChat._id,
//           chatName: groupChatName,
//   },
export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found");
  }
  res.json(updatedChat);
});

// PUT http://localhost:5000/chats/groupremove
// {
//           chatId: selectedChat._id,
//           userId: user1._id,
//  },
export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const removeUsers = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removeUsers) {
    res.status(400);
    throw new Error("Chat Not Found");
  }
  res.json(removeUsers);
});

// PUT :     http://localhost:5000/chats/groupadd
//  {
//           chatId: selectedChat._id,
//           userId: user1._id,
//   },
export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const addUsers = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    },
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addUsers) {
    res.status(400);
    throw new Error("Chat Not Found");
  }
  res.json(addUsers);
});
