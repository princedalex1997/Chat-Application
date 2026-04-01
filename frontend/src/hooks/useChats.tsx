import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js"

export const useChats = () => {
    const {chatLists, setChatLists, selectedChat, setSelectedChat } = useContext(AuthContext)
    return { chatLists, setChatLists, selectedChat, setSelectedChat }
}

