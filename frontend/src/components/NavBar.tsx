import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useChats } from '../hooks/useChats';




const NavBar = () => {
  const { selectedChat, setSelectedChat } = useChats()

  const { logOutUser, user } = useAuth()

  const navigation = useNavigate()

  const getChatUserName = (users = []) => {
        if (!users.length) return "No Users";
        const otherUser = users.find(u => u._id !== user._id);
        return otherUser && otherUser?.name
    };

  const handleLogOut = (value?: string | null) => {
    navigation("/")
    logOutUser(null)
  }
  console.log("selectedChat", selectedChat)

  return (
    <nav className={` ${selectedChat ? "flex " : "hidden"}  items-center justify-between px-6 py-3 bg-white border-b
     border-gray-100 shadow-sm sticky top-0 z-10 h-17.5`}>

      {/* Left Side: Back Button & User Info */}
      <div className="flex items-center gap-4 cursor-pointer group">
        {/* Back Button (Visible on Mobile Only) */}
        <button className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          ←
        </button>

        {/* User Avatar with Online Status */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-sm">
            JD
          </div>
          {/* Online Dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>

        {/* Name & Status */}
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
           {selectedChat.isGroupChat === "true" ? selectedChat.chatName : getChatUserName(selectedChat?.users)}
          </h2>
          <span className="text-xs text-green-500 font-medium tracking-wide">
            Online
          </span>
        </div>
      </div>

      {/* Right Side: Interaction Icons */}
      <div className="flex items-center gap-2">
        {/* Video Call */}
        <button title="Video Call" className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-all">
          📹
        </button>

        {/* Audio Call */}
        <button title="Voice Call" className="p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 rounded-full transition-all">
          📞
        </button>

        {/* Divider */}
        <div className="w-1 h-6 bg-gray-200 mx-1"></div>

        {/* Options Menu */}
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button variant="contained" {...bindTrigger(popupState)}>
                ⋮
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
                <Button onClick={() => handleLogOut()} >Primary</Button>

              </Popover>
            </div>
          )}
        </PopupState>

      </div>

    </nav>
  );
};

export default NavBar;