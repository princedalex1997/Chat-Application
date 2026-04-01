export type USER = {
  _id: string;
  email: string;
  name: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  isAdmin?: boolean;
  isGroupChat?: boolean;
  chatName: string;
};

export type ChatUser = {
  _id: string;
  name?: string;
  email?: string;
  avatar?: string;
  lastMessage?: string;
  isOnline?: boolean;
  updatedAt: string;
  users: USER[];
  isGroupChat?: string;
  chatName: string;
};

type ChatList = {
  _id:string;
  chatName:string;
  createdAt:string;
  updatedAt:string;
  isGroupChat:string;
  latestMessage:string;
  users: USER[];
__v: string
}

export type AuthContextType = {
  user: USER | null;
  setUser: React.Dispatch<React.SetStateAction<USER | null>>;
  loginUser: (u: USER) => void;
  logOutUser: (u: any) => void;
  selectedChat: USER[] | null;
  setSelectedChat: React.Dispatch<React.SetStateAction<USER[] | null>>;
  chatLists: ChatList[];
  setChatLists: React.Dispatch<React.SetStateAction<ChatList[] | null>>;
};
export type ChatListPROPS = {
  lists: ChatUser[];
  searchOptions: string;

  setOptions: (value: string) => void;
  handleSearchChat: () => void;
  loading: Boolean;
};
