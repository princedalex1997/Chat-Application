import { ReactNode, useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextType, USER } from "../types/types";

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<USER | null>(() => {
    try {
      const saveUser = localStorage.getItem("userInfo");
      return saveUser ? JSON.parse(saveUser) : null;
    } catch {
      return null;
    }
  });
  const [chatLists, setChatLists]  = useState([])
  const [selectedChat, setSelectedChat] = useState<USER[]>([])

  const loginUser = (u: USER) => {
    if (!u || !u._id) {
      throw new Error("Invalid user object");
    }
    setUser(u)
    localStorage.setItem("userInfo", JSON.stringify(u));
  }

  const logOutUser = () => {
    setUser(null)
    localStorage.removeItem("userInfo")
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logOutUser, chatLists, setChatLists, selectedChat, setSelectedChat }}>
      {children}
    </AuthContext.Provider>
  );
};



export default AuthProvider;
