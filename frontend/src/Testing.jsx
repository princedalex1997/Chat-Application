import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { useChats } from "../hooks/useChats";
import { useAuth } from "../hooks/useAuth";
import { SENTMESSAGESBYID, BASE_URL } from "../DATA/APIList.js";
import axios from "axios";
import io from "socket.io-client";
import LottieComponent from "lottie-react";
import ChatTyping from "../assets/animation/ChatTyping.json"


const Lottie = LottieComponent.default || LottieComponent;

const ENDPOINT = BASE_URL;

const ChatPage = () => {
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [inputMsgLoading, setInputMsgLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false); // My typing status
  const [isTyping, setIsTyping] = useState(false); // Other person's typing status

  const { selectedChat } = useChats();
  const { user } = useAuth();

   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ChatTyping,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };



  const socket = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const selectedChatCompare = useRef(null);

  // Initialize Socket
  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", user);
    socket.current.on("connected", () => setSocketConnection(true));
    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.current.disconnect();
    };
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch messages and handle room joining
  useEffect(() => {
    if (!selectedChat) return;

    fetchMessages();
    selectedChatCompare.current = selectedChat;
    inputRef.current?.focus();
  }, [selectedChat]);

  // Socket listener for receiving messages
  useEffect(() => {
    const messageHandler = (newMessageReceived) => {
      if (
        !selectedChatCompare.current ||
        selectedChatCompare.current._id !== newMessageReceived.chat._id
      ) {
        // Handle notification logic here
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.current.on("message recieved", messageHandler);

    return () => {
      socket.current.off("message recieved", messageHandler);
    };
  }, []);

  const fetchMessages = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    setLoadingMessage(true);
    try {
      const { data } = await axios.get(`${SENTMESSAGESBYID}${selectedChat._id}`, config);
      setMessages(data);
      socket.current.emit("join room", selectedChat._id);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    socket.current.emit("stop typing", selectedChat._id);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    setInputMsgLoading(true);
    try {
      const { data } = await axios.post(
        `${SENTMESSAGESBYID}`,
        { content: inputMessage, chatId: selectedChat?._id },
        config
      );
      setInputMessage("");
      socket.current.emit("new message", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Send Error:", error);
    } finally {
      setInputMsgLoading(false);
    }
  };

  const handleTypingLogic = (e) => {
    setInputMessage(e.target.value);
    if (!socketConnection) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.current.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {selectedChat ? (
        <>
          <NavBar />
          {loadingMessage ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                  const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                        }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-[10px] mt-1 opacity-70 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-gray-200 rounded-2xl rounded-bl-none px-3 py-2 shadow-sm">
                      <div className="w-12 h-6 flex items-center justify-center">
                         <Lottie
                    animationData={ChatTyping}
                    loop={true}
                    style={{ height: 90 }} // Adjust height to fit your bubble
                  />
                        
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input Area */}
              <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                  <input
                    ref={inputRef}
                    className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    type="text"
                    placeholder="Type a message..."
                    value={inputMessage}
                    onChange={handleTypingLogic}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={inputMsgLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim() || inputMsgLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-2xl transition-all active:scale-95 shadow-md flex items-center justify-center"
                  >
                    {inputMsgLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                    )}
                  </button>
                 

                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800">Welcome to Chat</h1>
            <p className="text-gray-400 mt-2">Select a user to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;