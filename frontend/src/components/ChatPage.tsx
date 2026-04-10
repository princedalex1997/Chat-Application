import React, { useEffect, useRef, useState } from "react";
import NavBar from "./NavBar";
import { useChats } from "../hooks/useChats";
import { useAuth } from "../hooks/useAuth";
import { SENTMESSAGESBYID, BASE_URL } from "../DATA/APIList.js";
import axios from "axios";
import getChatTimestamp from "../pages/UI/UX.jsx";
import io from "socket.io-client";
import LottieComponent from "lottie-react";
import ChatTyping from "../assets/animation/ChatTyping.json";
import chatLoading from "../assets/animation/chatLoading.json";
import loading from "../assets/animation/loading.json";
import propic from "../assets/Images/propic.webp";

const Lottie = LottieComponent.default || LottieComponent;

const ENDPOINT = BASE_URL;
// const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatPage = () => {
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [inputMsgLoading, setInputMsgLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [IsTyping, setIsTyping] = useState(false);
  const { selectedChat } = useChats();
  const { user } = useAuth();

  const bottonRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnection(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    bottonRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if(!selectedChat._id) return;
    fetchMessages();
    selectedChatCompare = selectedChat;
    inputRef.current?.focus();
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecived: any) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        // give notification
      } else {
        setMessages([...messages, newMessageRecived]);
      }
    });
  });
  const handleSend = async () => {
    if (!inputMessage.trim()) return;

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
        {
          content: inputMessage,
          chatId: selectedChat?._id,
        },
        config,
      );

      // Update local messages state so the new message appears immediately
      setMessages((prev) => [...prev, data]);
      // console.log("Data is ", data);
      socket.emit("new message", data);
      setInputMessage(""); // Clear input after success
    } catch (error) {
      console.log("Error is", error);
    } finally {
      setInputMsgLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setLoadingMessage(true);

    try {
      const { data } = await axios.get(
        `${SENTMESSAGESBYID}${selectedChat._id}`,
        config,
      );
      setMessages(data);
      socket.emit("join room", selectedChat._id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleTying = (e: any) => {
    setInputMessage(e.target.value);

    if (!socketConnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTimeLength = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timerNow = new Date().getTime();
      var timerDiff = timerNow - lastTimeLength;
      if (timerDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
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


  // console.log(selectedChat);


  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {selectedChat ? (
        <>
          <NavBar />

          {loadingMessage ? (
            <div className="flex-1 flex items-center justify-center">
              {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div> */}
              <Lottie
                animationData={loading}
                loop={true}
                style={{ width: 400 }}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 bg-[#f0f2f5]">
              {/* Messages List Area */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300">
                {messages.length > 0 ? (
                  <>
                    {messages.map((msg, index) => {
                      const isMe =
                        msg.sender?._id === user?._id ||
                        msg.sender === user?._id;

                      return (
                        <div
                          key={index}
                          className={`flex w-full items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} mb-4`}
                        >
                          {/* Profile Image */}
                          <div
                            className={` ${isMe ? "hidden" : ""} shrink-0  `}
                          >
                            <img
                              src={msg.sender?.pic || propic}
                              alt="profile"
                              className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
                            />
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`relative max-w-[70%] md:max-w-[60%] px-4 py-2.5 shadow-sm transition-all ${isMe
                              ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                              : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-none"
                              }`}
                          >
                            {/* Sender Name (Optional: only show for group chats or other person) */}
                            {!isMe && selectedChat?.isGroupChat !== "false" && (
                              <p className="text-[10px] font-bold text-blue-500 mb-0.5">
                                {msg.sender?.name}
                              </p>
                            )}

                            <p className="text-[15px] leading-relaxed wrap-break-words">
                              {msg.content}
                            </p>

                            <div
                              className={`text-[10px] mt-1 flex justify-end items-center gap-1 font-medium opacity-60 ${isMe ? "text-blue-100" : "text-gray-400"
                                }`}
                            >
                              {formatTime(msg?.createdAt)}
                              {isMe && (
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Typing Indicator (Placed OUTSIDE the map, inside the scroll area) */}
                    {IsTyping && (
                      <div className="flex justify-start animate-pulse">
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-1 shadow-sm flex items-center h-10">
                          <Lottie
                            animationData={ChatTyping}
                            loop={true}
                            style={{ height: 45, width: 45 }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                    <Lottie
                      animationData={chatLoading}
                      loop={true}
                      style={{ width: 500 }}
                    />
                    <p> Please Select the chat</p>
                  </div>
                )}
                {/* This is the magic div for auto-scroll */}
                <div ref={bottonRef} className="h-2" />
              </div>

              {/* Input Footer */}
              <div
                className={`${selectedChat == "" ? "hidden" : ""} bg-white/80 backdrop-blur-md border-t
   border-gray-200 px-4 py-4 sm:px-6`}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="relative flex items-center gap-2 bg-gray-100 rounded-2xl px-2 py-1 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                    <input
                      ref={inputRef}
                      className="flex-1 bg-transparent border-none outline-none py-3 px-3 text-[15px] placeholder-gray-400"
                      type="text"
                      placeholder="Write something..."
                      value={inputMessage}
                      onChange={handleTying}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      disabled={inputMsgLoading}
                    />
                    {/* <input  src="" alt="" /> */}

                    <button
                      onClick={handleSend}
                      disabled={!inputMessage.trim() || inputMsgLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white w-10 h-10 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0"
                    >
                      {inputMsgLoading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg
                          className="w-5 h-5 rotate-90 transform -translate-y-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    Press Enter to send
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="h-screen flex flex-col items-center justify-center text-gray-500 p-6 text-center">
          <div className="bg-white shadow-xl p-8 rounded-3xl">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Select a Chat</h1>
            <p className="mt-2 text-gray-500 max-w-xs">
              Pick a conversation from the sidebar to start.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
