export type USER = {
  _id: string;
  email: string;
  name: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  isAdmin?: boolean;
  isGroupChat?:boolean;
  chatName:string
};

export type AuthContextType = {
  user: USER | null;
  setUser: React.Dispatch<React.SetStateAction<USER | null>>;
  loginUser: (u: USER) => void;
  logOutUser: (u: any) => void;
  chatUserList: USER[] | null;
  setChatUserList: React.Dispatch<React.SetStateAction<USER[] | null>>;
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
  users: USER[];
  isGroupChat?:true;
  chatName:string
};
export type ChatListPROPS = {
  lists: ChatUser[];
  searchOptions: string;

  setOptions: (value: string) => void;
  handleSearchChat: () => void;
  loading: Boolean;
};
