import asyncHandler from "express-async-handler";
import Message from "../models/MessageModel.js";
import User from "../models/UserModels.js";
import Chat from "../models/ChatModel.js";

// Sent Message

//  POST ,http://localhost:5000/message
// {
// 	"content":"hi Testinggg 2",
//  "chatId": "69c54b4c9052cddf06db0bc2"
// }
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.error("Invalid data passed into request");
    res.sendStatus(400);
    return;
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  // console.log("REQ BODY:", req.body);

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name email");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message._id,
    });
    const chatExists = await Chat.findById(chatId);
    if (!chatExists) {
      return res.status(400).json({ error: "Chat not found" });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Fetch all the chats
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
