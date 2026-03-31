import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js"

export const useChats = () => {
    const { selectedChat, setSelectedChat } = useContext(AuthContext)
    return { selectedChat, setSelectedChat }
}

