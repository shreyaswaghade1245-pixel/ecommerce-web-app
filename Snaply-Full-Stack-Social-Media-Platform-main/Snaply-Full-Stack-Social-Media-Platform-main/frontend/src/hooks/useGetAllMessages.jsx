import { setMessages } from '@/redux/chatSlice';
import { setPosts } from '@/redux/postSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store=>store.auth);

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllMessages();
    },[selectedUser])
}

export default useGetAllMessages
