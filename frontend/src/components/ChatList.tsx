import React, { memo, useState } from 'react';
import { ChatListPROPS } from '../types/types';
import { dummyChatUsersList } from "../DATA/Dummy"
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FETCHCHATLIST } from "../DATA/APIList"
import { useAuth } from '../hooks/useAuth';
import SkeletonLoading from "../pages/UI/UX"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



const ChatList = ({ lists, searchOptions, setOptions, handleFetchChatList, loading }: ChatListPROPS) => {
    const [openProfileModal, setOpenProfileModal] = React.useState(false);
    const handleProfileModalOpen = () => setOpenProfileModal(true);
    const handleProfileModalClose = () => setOpenProfileModal(false);

    const { user } = useAuth()


    const Dummyprofile = dummyChatUsersList[0]


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
                        onClick={handleFetchChatList}
                    >
                        GO
                    </button>
                </div>
                <div onClick={handleProfileModalOpen} >
                    <img
                        className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shrink-0 shadow-sm"

                        src={Dummyprofile.avatar} alt={Dummyprofile.name?.charAt(0).toUpperCase()} />
                </div>
            </div>

            {/* 2. Scrollable List Area */}
            {/* flex-1 makes this div take up all remaining space, overflow-y-auto enables scrolling */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <SkeletonLoading />
                ) :
                    <div className="flex flex-col divide-y divide-gray-100">
                        {lists.map((user) => (
                            <div
                                key={user?._id}
                                className="flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
                            >
                                {/* Avatar */}
                                {user.avatar ?
                                    <img
                                        className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shrink-0 shadow-sm"

                                        src={user.avatar} alt={user.name?.charAt(0).toUpperCase()} />
                                    :

                                    <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                                        {user.name?.charAt(0).toUpperCase()}

                                    </div>
                                }

                                {/* Message Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {user.name}
                                        </h3>
                                        <span className="text-[10px] text-gray-400 shrink-0 uppercase">12:45 PM</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate mt-0.5">
                                        {user.lastMessage || "No messages yet..."}
                                    </p>
                                </div>

                                {/* Unread Indicator */}
                                <div className="flex flex-col items-end shrink-0">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
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
                    },
                }}
            >
                <Fade in={openProfileModal}>
                    <Box sx={style}>
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default memo(ChatList);