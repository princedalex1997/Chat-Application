import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ChatList from '../components/ChatList'
import ChatPage from '../components/ChatPage'
import { dummyChatUsersList } from "../DATA/Dummy"
import { FETCHCHATLIST, FETCHCHATUSER } from "../DATA/APIList"
import axios from "axios"
import { useChats } from '../hooks/useChats'

const ChatsHome = () => {
  const [loading, setLoading] = useState(false)
  const [searchOptions, setOptions] = useState<string>("")
  const [chatList, setChatList] = useState([])
  const { user } = useAuth()
  const { chatUserList, setChatUserList } = useChats()

  const handleSearchChat = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${FETCHCHATUSER}?search=${searchOptions}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchChatList = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(
        `${FETCHCHATLIST}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setChatList(data)
    //  setChatUserList(prev => [...prev, data.users[0]]);
      // console.log("handleFetchChatList is :", data)
    } catch (error) {
      console.warn("Error in handleFetchChatList ", handleFetchChatList)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    handleFetchChatList()
  }, [])

  return (
    <div className="lg:p-5 bg-[#6366F1] h-screen w-full flex flex-col overflow-hidden">

      <div className="flex flex-row gap-3 h-full overflow-hidden">

        {/* Chats List Sidebar */}
        {/* Changed w-90 to a standard w-80 or w-[350px] and added h-full */}
        <div className="hidden md:flex w-80 shrink-0 bg-[#1E293B] text-white rounded-xl overflow-hidden  flex-col border border-slate-700 shadow-xl">
          <ChatList lists={chatList} loading={loading} searchOptions={searchOptions} setOptions={setOptions} handleSearchChat={handleSearchChat} />
        </div>

        {/* Chats Page Main Content */}
        {/* flex-1 allows this to take all remaining space without overflowing the screen */}
        <div className="flex-1 bg-[#10B981] rounded-xl overflow-hidden border border-emerald-600 shadow-xl">
          <ChatPage />
        </div>

      </div>

    </div>
  )
}

export default ChatsHome
