import React from 'react'

const Testing = () => {
  return (
    <div>
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
                    //  {chat?.users && getChatUserName(chat.users)}
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
    </div>
  )
}

export default Testing