import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js"

export const useChats = () => {
    const { chatUserList, setChatUserList } = useContext(AuthContext)
    return { chatUserList, setChatUserList }
}

