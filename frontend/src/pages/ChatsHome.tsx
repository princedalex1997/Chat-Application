import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ChatList from '../components/ChatList'
import ChatPage from '../components/ChatPage'
import { dummyChatUsersList } from "../DATA/Dummy"
import { FETCHCHATLIST } from "../DATA/APIList"

const ChatsHome = () => {
  const [loading, setLoading] = useState(false)
  const [searchOptions, setOptions] = useState<string>("")

  const { user } = useAuth()


  const handleFetchChatList = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${FETCHCHATLIST}?search=${searchOptions}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      console.log("Data", data);

    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  };



  return (
    <div className="lg:p-5 bg-[#6366F1] h-screen w-full flex flex-col overflow-hidden">

      <div className="flex flex-row gap-3 h-full overflow-hidden">

        {/* Chats List Sidebar */}
        {/* Changed w-90 to a standard w-80 or w-[350px] and added h-full */}
        <div className="hidden md:flex w-80 shrink-0 bg-[#1E293B] text-white rounded-xl overflow-hidden  flex-col border border-slate-700 shadow-xl">
          <ChatList lists={dummyChatUsersList} loading={loading} searchOptions={searchOptions} setOptions={setOptions} handleFetchChatList={handleFetchChatList} />
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
