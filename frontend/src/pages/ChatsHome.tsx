import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ChatList from '../components/ChatList'
import ChatPage from '../components/ChatPage'
import { dummyChatUsersList } from "../DATA/Dummy"
import { FETCHCHATLIST, FETCHCHATUSER } from "../DATA/APIList"
import axios from "axios"
import { useChats } from '../hooks/useChats'
import { USER } from '../types/types'

const ChatsHome = () => {
  const [loading, setLoading] = useState(false)
  const [searchOptions, setOptions] = useState<string>("")
  const { user } = useAuth()
  const { chatLists, setChatLists } = useChats()
  const [searchUserLoading, setSearchUserLoading] = useState<Boolean>(false)
  const [searchUserList, setSearchUserList] = useState<USER[]>([])

  useEffect(() => {
    if (!searchOptions) return;
    const delayDebounceFn = setTimeout(() => {
      handleSearchChat(searchOptions)
    }, 500);

    return () => clearTimeout(delayDebounceFn)
  }, [searchOptions])

  const handleSearchChat = async (searchOptions: string) => {
    if (!searchOptions || !user) return
    // setOptions(e.target.value)
    setSearchUserLoading(true);
    try {
      const { data } = await axios.get(
        `${FETCHCHATUSER}?search=${searchOptions}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSearchUserList(data)
    } catch (error: any) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setSearchUserLoading(false);
    }
  };

  const handleFetchChatList = async () => {
    // setLoading(true)
    try {
      const { data } = await axios.get(
        `${FETCHCHATLIST}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setChatLists(Array.isArray(data) ? data : [])

    } catch (error) {
      console.warn("Error in handleFetchChatList ", error)
    } finally {
      // setLoading(false)
    }
  }

  useEffect(() => {
    handleFetchChatList()
    //  setChatLists(list)
  }, [])

  return (
    <div className="lg:p-5 bg-[#6366F1] h-screen w-full flex flex-col overflow-hidden">

      {loading ? <section className='flex  h-screen justify-center items-center' > Loading </section>
        :
        <div className="flex flex-row gap-3 h-full overflow-hidden">

          {/* Chats List Sidebar */}
          {/* Changed w-90 to a standard w-80 or w-[350px] and added h-full */}

          <div className="hidden md:flex w-80 shrink-0 bg-[#1E293B] text-white rounded-xl overflow-hidden  flex-col border border-slate-700 shadow-xl">
            <ChatList lists={chatLists} searchOptions={searchOptions}
              setOptions={setOptions} handleSearchChat={handleSearchChat} searchUserLoading={searchUserLoading} searchUserList={searchUserList} />
            {/* : <h1 className='flex items-center justify-center text-center' >Not Chat List Founded</h1>} */}
          </div>

          {/* Chats Page Main Content */}
          {/* flex-1 allows this to take all remaining space without overflowing the screen */}
          <div className="flex-1 bg-[#10B981] rounded-xl overflow-hidden border border-emerald-600 shadow-xl">
            <ChatPage />
          </div>

        </div>
      }

    </div>
  )
}

export default ChatsHome
