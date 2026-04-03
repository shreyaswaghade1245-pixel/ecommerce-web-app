import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = ({ socket }) => {
    const [selectedChat, setSelectedChat] = useState(false);
    const [textMessage, setTextMessage] = useState('');
    const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);


    const { onlineUsers, messages } = useSelector((store) => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        if (!textMessage.trim()) return;
        try {
            const res = await axios.post(
                `http://localhost:8000/api/v1/message/send/${receiverId}`,
                { textMessage },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage('');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const showChatHandler = () => {
        setSelectedChat(true);
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        };
    }, []);

    return (
        <div className="flex md:h-170">
            {/* Sidebar */}
            <aside className="bg-white border-r border-gray-200 
                    flex flex-col 
                    md:w-75 md:shrink-0 md:ml-65 mt-3
                    ">

                {/* Header */}
                <div className="p-4 border-b border-gray-200 font-bold text-xl">
                    {user?.username}
                </div>
                <div className="p-4 border-b border-gray-200 text-md">Primary</div>

                {/* Chat list: scroll only on desktop */}
                <div className="flex-1 overflow-y-auto md:overflow-y-auto">
                    {suggestedUsers?.map((suggestedUser) => {
                        const isOnline = onlineUsers.includes(suggestedUser?._id);
                        return (
                            <div
                                key={suggestedUser._id}
                                onClick={() => {
                                    dispatch(setSelectedUser(suggestedUser));
                                    setSelectedChat(true);
                                }}
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src={suggestedUser?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{suggestedUser?.username}</span>
                                    <span className={`text-xs font-semibold ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                                        {isOnline ? "online" : "offline"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Chat area */}
            <section className="flex-1 flex flex-col ">
                {selectedUser ? (
                    <div className="flex flex-col h-full md:justify-between">
                        {/* Chat header */}
                        <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
                            <Avatar>
                                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-lg">{selectedUser?.username}</span>
                        </div>

                        {/* Messages scrollable only on desktop */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 md:flex-1 md:overflow-y-auto">
                            <Messages socket={socket} selectedUser={selectedUser} />
                        </div>

                        {/* Input bar */}
                        <div className="flex items-center gap-2 p-4 border-t border-gray-200 bg-white
                        md:sticky md:bottom-0 md:z-20">
                            <Input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                type="text"
                                placeholder="Message..."
                                className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus-visible:ring-0"
                            />
                            <Button
                                onClick={() => sendMessageHandler(selectedUser?._id)}
                                className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircleCode className="w-28 h-28 mb-4" />
                        <h1 className="text-xl font-medium mb-1">Your Messages</h1>
                        <span>Send a message to start a chat</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ChatPage;
