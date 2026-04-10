import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { useChats } from '../hooks/useChats';
import { useAuth } from '../hooks/useAuth';
import { SENTMESSAGESBYID, BASE_URL } from "../DATA/APIList.js";
import axios from 'axios';
import getChatTimestamp from "../pages/UI/UX.jsx"
import io from "socket.io-client"

const ENDPOINT = BASE_URL;
// const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatPage = () => {
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [inputMsgLoading, setInputMsgLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const { selectedChat } = useChats();
  const { user } = useAuth();


  

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
        config
      );

      // Update local messages state so the new message appears immediately
      setMessages((prev) => [...prev, data]);
      setInputMessage(""); // Clear input after success
      console.log("Data Sent:", data);
    } catch (error) {
      console.log("Error is", error);
    } finally {
      setInputMsgLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    };
    setLoadingMessage(true)

    try {
      const { data } = await axios.get(`${SENTMESSAGESBYID}${selectedChat._id}`, config)
      setMessages(data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMessage(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [selectedChat])

  useEffect(()=>{
    socket = io(ENDPOINT)
  },[])
  // console.log("Message ," , messages)
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {selectedChat ? (
        <>
          <NavBar />

          {loadingMessage ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Messages List Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                  messages.map((msg, index) => {
                    // Check if message is from the logged-in user
                    const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                    const formatTime = (isoString: string) => {
                      const date = new Date(isoString);
                      return date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      });
                    };

                    // Result: "11:19 AM"
                    return (
                      <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm ${isMe
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                          }`}>
                          {msg.content}
                          {/* <p className='text-sm text-end' > {getChatTimestamp(msg?.createdAt)} </p> */}

                          {/* Wrapper to ensure the time stays below the content but within the flow */}
                          <p className={`text-[10px] mt-1 font-medium tracking-wide opacity-70 ${isMe ? 'text-blue-100 text-end' : 'text-gray-400 text-end'}`}>
                            {formatTime(msg?.createdAt)}
                          </p>                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="bg-gray-200 px-4 py-1 rounded-full text-sm">No messages yet</p>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              <div className="bg-white border-t border-gray-200 p-4 pb-15">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                  <input
                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all"
                    type="text"
                    placeholder="Write something..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={inputMsgLoading}
                  />

                  <button
                    onClick={handleSend}
                    disabled={!inputMessage.trim() || inputMsgLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center min-w-12.5"
                  >
                    {inputMsgLoading ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20">
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
        <div className="h-screen flex flex-col items-center justify-center text-gray-500 p-6 text-center">
          <div className="bg-white shadow-xl p-8 rounded-3xl">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Select a Chat</h1>
            <p className="mt-2 text-gray-500 max-w-xs">Pick a conversation from the sidebar to start.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;