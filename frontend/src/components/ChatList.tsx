import React, { memo, useEffect, useState } from 'react';
import { ChatListPROPS, USER } from '../types/types';
import { dummyChatUsersList } from "../DATA/Dummy"
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FETCHCHATUSER, FETCHCHATLIST } from "../DATA/APIList"
import { useAuth } from '../hooks/useAuth';
import SkeletonLoading from "../pages/UI/UX"
import { useChats } from '../hooks/useChats';
import { TextField } from '@mui/material';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 450 }, // Responsive width
    bgcolor: 'background.paper',
    borderRadius: '16px', // Modern rounded corners
    boxShadow: '0px 10px 40px rgba(0,0,0,0.12)',
    p: 4,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
};

const ChatList = ({ lists, searchOptions, setOptions, handleSearchChat, loading }: ChatListPROPS) => {
    const [openProfileModal, setOpenProfileModal] = React.useState(false);
    const handleProfileModalOpen = () => setOpenProfileModal(true);
    const handleProfileModalClose = () => setOpenProfileModal(false);
    const [chatPorfile, setChatProfile] = useState([])
    const [searchUser, setSearchUser] = useState<string | null>("")
    const [searchUserList, setSearchUserList] = useState([])
const [selectedGropAddList, setSelectedGropAddList] = useState([]);
    const [groupChatName, setGroupChatName] = useState("")


    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [addGroupLoading, setAddGroupLoading] = useState(false)

    const { selectedChat, setSelectedChat } = useChats()
    const { user } = useAuth()
    const Dummyprofile = dummyChatUsersList[0]

    const handleClick = (k: any) => {
        const chatIs = k.find((u: any) => u._id !== user._id)
        setChatProfile(chatIs)
        setSelectedChat(chatIs)
        console.log(chatIs)
    }
    const getChatUserName = (users = []) => {
        if (!users.length) return "No Users";
        const otherUser = users.find(u => u._id !== user._id);
        return otherUser && otherUser?.name
    };
    //Debounde in useEffect
    useEffect(() => {
        const deb = setTimeout(() => {
            if (searchUser.trim()) {
                handleSearchUser(searchUser)
            }
        }, 400)
        return () => clearTimeout(deb)
    }, [searchUser])
    const handleSearchUser = async (query: string) => {
        setSearchLoading(true)
        if (!searchUser || searchUser.trim().length === 0) return
        try {
            const { data } = await axios.get(
                `${FETCHCHATUSER}?search=${query}`,
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );
            setSearchUserList(data)
            // console.log("setSearchUserList is :", data)
        } catch (error) {
            console.warn("Error in handleFetchChatList ", error.message)
        } finally {
            setSearchLoading(false)
        }
    }
    const handleSelectedAddUserToList = (userId: string) => {
        setSelectedGropAddList((prev) =>
            prev.includes(userId) ? prev : [...prev, userId]
        );
    };
    const handleAddGroup = async () => {
        setAddGroupLoading(true);

        console.log(`${FETCHCHATLIST}group`);

        try {
            const { data } = await axios.post(
                `${FETCHCHATLIST}group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedGropAddList), // ✅ no stringify needed (usually)
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            alert("Done");
            console.log("Done", data);

        } catch (error: any) {
            console.log("error ins API");
            
            console.log(error.message);
        } finally {
            setAddGroupLoading(false);
        }

        console.log("selectedGropAddList", selectedGropAddList);
    };



    return (
        /* 1. Fix the height to screen and use flex-col */
        <div className="flex flex-col h-screen max-w-md border-r border-gray-200 bg-white">

            {/* Header / Search Area (Fixed Height) */}
            <div className="p-4 border-b flex flex-row items-center">
                <div className="flex items-center rounded-full px-2 bg-gray-100 border-2 border-transparent transition-all duration-300 focus-within:bg-white focus-within:border-blue-500 focus-within:shadow-md">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="bg-transparent border-none outline-none flex-1 p-2 text-sm text-gray-700 placeholder-gray-400"
                        value={searchOptions}
                        // onChange={(e) => setOptions(e.target.value)}
                        onChange={(e) => setOptions(e.target.value)}
                        maxLength={30}
                    />
                    <button
                        type="button"
                        className={`
                            bg-blue-500 text-white text-xs font-bold py-1.5 px-4 rounded-full
                            transition-all duration-300 ease-out transform
                            ${searchOptions.length > 0
                                ? "opacity-100 translate-x-0 scale-100"
                                : "opacity-0 translate-x-4 scale-90 pointer-events-none"
                            }
                            hover:bg-blue-600 active:scale-95
                        `}
                        onClick={handleSearchChat}
                    >
                        GO
                    </button>
                </div>
                <div onClick={handleProfileModalOpen}   >
                    {/* <img
                        className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shrink-0 shadow-sm"

                        src={Dummyprofile.avatar} alt={Dummyprofile.name?.charAt(0).toUpperCase()} /> */}
                    <h1 className='text-black' > create Group</h1>
                </div>
            </div>

            {/* 2. Scrollable List Area */}
            {/* flex-1 makes this div take up all remaining space, overflow-y-auto enables scrolling */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <SkeletonLoading />
                ) :
                    <div className="flex flex-col divide-y divide-gray-100">
                        {lists.map((chat) => (
                            <div key={chat._id}

                                className="flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100">
                                <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shrink-0 shadow-sm"
                                >
                                    {/* // {chat?.users && getChatUserName(chat.users)?.charAt(0).toUpperCase()} */}
                                    {chat?.users && getChatUserName(chat.users)?.charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0"
                                    onClick={() => handleClick(chat?.users)}
                                >
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {chat.isGroupChat === true ? chat?.chatName :
                                                chat?.users && getChatUserName(chat?.users)
                                            }

                                        </h3>
                                        <span className="text-[10px] text-gray-400 shrink-0 uppercase">12:45 PM</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mt-0.5">
                                        {chat?.lastMessage || "No messages yet..."}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                }

            </div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={openProfileModal}
                onClose={handleProfileModalClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: { backdropFilter: 'blur(4px)' } // Adds a modern blur to the background
                    },
                }}
            >
                <Fade in={openProfileModal}>
                    <Box sx={style}>
                        {/* Header Section */}
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2 // Margin bottom
                        }}>
                            <Typography id="transition-modal-title" variant="h5" sx={{ fontWeight: 600 }}>
                                Create Group
                            </Typography>

                            <Button
                                variant="contained"
                                disabled={!searchUser.trim() || addGroupLoading}
                                onClick={handleAddGroup}
                                sx={{ borderRadius: '8px', textTransform: 'none' }}
                            >
                               {addGroupLoading ? "Creating" :"Add" }
                            </Button>
                        </Box>

                        {/* Input Section */}
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Group Name"
                            variant="outlined"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            id="outlined-basic"
                            label="Group Name"
                            variant="outlined"
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            sx={{ mb: 3 }}
                        />

                        {/* Results Section */}
                        {searchUser.length > 1 || !searchLoading &&
                            <Typography variant="overline" sx={{ color: 'text.secondary', visibility: searchLoading ? "hidden" : "visible", fontWeight: 'bold' }}>
                                Suggested Users
                            </Typography>
                        }
                        {searchLoading ? "Loading" : ""}

                        <Box sx={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            mt: 1,
                            // Custom scrollbar styling
                            '&::-webkit-scrollbar': { width: '6px' },
                            '&::-webkit-scrollbar-thumb': { backgroundColor: '#ccc', borderRadius: '10px' }
                        }}>
                            {searchUserList.length > 0 ? (
                                searchUserList.map((item) => (
                                    <Box
                                        key={item._id}
                                        sx={{
                                            p: 1.5,
                                            mb: 1,
                                            borderRadius: '8px',
                                            bgcolor: '#f9f9f9',
                                            '&:hover': { bgcolor: '#f0f0f0' },
                                            transition: '0.2s'
                                        }}
                                        onClick={() => handleSelectedAddUserToList(item._id)}
                                    >
                                        <Typography variant="body2" sx={{ color: 'gray' }} >{item?.name}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ color: 'gray', display: `${searchLoading && "hidden"}`, fontStyle: 'italic', mt: 1 }}>
                                    {searchUser.length > 0 && "  No users found..."}
                                </Typography>
                            )}


                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default memo(ChatList);
