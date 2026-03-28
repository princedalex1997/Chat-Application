import React from 'react'
import { useAuth } from '../hooks/useAuth'

const Chats = () => {
  const { user } = useAuth()

  return (
    <div>
      <h1>Chats</h1>
    </div>
  )
}

export default Chats
