import React from 'react'
import NavBar from './NavBar'
import { useChats } from '../hooks/useChats'

const ChatPage = () => {
  const { selectedChat, setSelectedChat } = useChats()
  return (

    <div>
      {selectedChat ? (
        <>
          <NavBar />
          <h1>Chat Page</h1>
        </>
      ) : (
        "Select Chat"
      )}
    </div>
  )
}

export default ChatPage