import { useContext } from "react";
import {AuthContext} from "../context/AuthContext.js"

export const useAuth = () => {
    
  const context = useContext(AuthContext);
  if(!context){
    throw new Error("Context not Founded")
  }
  return context
};

