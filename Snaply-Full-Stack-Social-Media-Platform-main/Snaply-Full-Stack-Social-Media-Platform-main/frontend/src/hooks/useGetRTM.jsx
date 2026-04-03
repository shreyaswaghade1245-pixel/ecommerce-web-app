import { setMessages } from '@/redux/chatSlice';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetRTM = (socket) => {
    const dispatch = useDispatch();
    const {messages} = useSelector(store=>store.chat);
    
    useEffect(() => {
        if (!socket) return; 

        socket?.on('newMessage', (newMessage)=>{
            dispatch(setMessages([...messages, newMessage]))
        })

        return ()=>{
            socket?.off('newMessage');
        }

    },[messages, dispatch, socket])
}

export default useGetRTM
