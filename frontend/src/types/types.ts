export type USER = {
  _id: string;
  email: string;
  name: string;
  token?: string;
};

export type AuthContextType = {
  user: USER | null;
  setUser: React.Dispatch<React.SetStateAction<USER | null>>;
  loginUser: (u: USER) => void;
  logOutUser: (u:any) => void;
};

export type ChatUser = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  lastMessage: string;
  unreadCount?: number;
  isOnline?: boolean;
  updatedAt: string;
};
export type ChatListPROPS = {
  lists:ChatUser[];
  searchOptions:string;
  
  setOptions : (value:string) => void
  handleFetchChatList : ()=>void;
  loading:Boolean

}
