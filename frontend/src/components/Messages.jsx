import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetRTM from '@/hooks/useGetRTM';

const Messages = ({ selectedUser, socket }) => {
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  const scrollRef = useRef();

  useGetRTM(socket);
  useGetAllMessages();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-200 overflow-y-auto p-6 bg-gray-50">
      {/* User Info */}
      <div className="flex flex-col items-center mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="font-semibold mt-2">{selectedUser?.username}</span>
        <Link to={`/profile/${selectedUser?._id}`}>
          <Button variant="secondary" className="mt-2 h-8 px-4">
            View Profile
          </Button>
        </Link>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg, idx) => {
            const isSender = msg.senderId === user?._id;
            return (
              <div
                key={idx}
                ref={scrollRef}
                className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[65%] break-words ${
                    isSender
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
