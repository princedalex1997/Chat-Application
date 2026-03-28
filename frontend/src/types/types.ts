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
