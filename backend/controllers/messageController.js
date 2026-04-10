import asyncHandler from "express-async-handler";
import Message from "../models/MessageModel.js";
import User from "../models/UserModels.js";
import Chat from "../models/ChatModel.js";

// Sent Message

//  POST ,http://localhost:5000/message
// {
// 	"content":"hi Testinggg 2",
//  "chatId": "69c54b4c9052cddf06db0bc2"
//   "img":img
// }
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, userId, img } = req.body;

  // 🔴 Validate input
  if (!content) {
    return res.status(400).json({ error: "Content required" });
  }

  if (!chatId && !userId) {
    return res.status(400).json({
      error: "Either chatId or userId must be provided",
    });
  }

  let chat = null;

  // ✅ Case 1: chatId provided
  if (chatId) {
    chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Invalid chatId" });
    }

    // 🔒 Authorization check
    const isUserInChat = chat.users.some(
      (u) => u.toString() === req.user._id.toString(),
    );

    if (!isUserInChat) {
      return res.status(403).json({ error: "Not authorized for this chat" });
    }
  }

  // ✅ Case 2: No chatId → find or create 1-to-1 chat
  if (!chat && userId) {
    // Try to find existing chat
    chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] },
    });

    // If not found → create new chat
    if (!chat) {
      chat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });
    }
  }

  // ❌ Final fallback
  if (!chat) {
    return res.status(400).json({ error: "Chat not found or created" });
  }

  // ✅ Create message
  let message = await Message.create({
    sender: req.user._id,
    content,
    chat: chat._id,
    img: img ? img : null,
  });

  // ✅ Populate message
  message = await message.populate("sender", "name email");
  message = await message.populate("chat");

  message = await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });

  // ✅ Update latest message in chat
  await Chat.findByIdAndUpdate(chat._id, {
    latestMessage: message._id,
  });

  // ✅ Send response
  res.status(200).json(message);
});

// Fetch all the messages
//http://localhost:5000/message/${69c54b4c9052cddf06db0bc2}

export const fetchAllChats = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// export const sendMessage = asyncHandler(async (req, res) => {
//   const { content, chatId, userId } = req.body;
//   if (!content || !chatId) {
//     console.error("Invalid data passed into request");
//     res.sendStatus(400);
//     return;
//   }
//   var newMessage = {
//     sender: req.user._id,
//     content: content,
//     chat: chatId,
//   };

//   // console.log("REQ BODY:", req.body);

//   try {
//     var message = await Message.create(newMessage);

//     message = await message.populate("sender", "name email");
//     message = await message.populate("chat");
//     message = await User.populate(message, {
//       path: "chat.users",
//       select: "name pic email",
//     });

//     await Chat.findByIdAndUpdate(req.body.chatId, {
//       latestMessage: message._id,
//     });
//     const chatExists = await Chat.findById(chatId);
//     if (!chatExists) {
//       return res.status(400).json({ error: "Chat not founds" });
//     }
//     res.status(200).json(message);
//   } catch (error) {
//     res.status(400);
//     throw new Error(error.message);
//   }
// });
