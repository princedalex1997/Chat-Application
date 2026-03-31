import React from 'react'
import NavBar from './NavBar'
import { useChats } from '../hooks/useChats'

const ChatPage = () => {
    const { chatUserList, setChatUserList } = useChats()
  
  return (

    <div>
      {chatUserList  ? (
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