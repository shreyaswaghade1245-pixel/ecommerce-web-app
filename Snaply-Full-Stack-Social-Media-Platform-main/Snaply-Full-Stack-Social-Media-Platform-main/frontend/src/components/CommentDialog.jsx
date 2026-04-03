import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import toast from 'react-hot-toast'
import { setPosts } from '@/redux/postSlice'
import axios from 'axios'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState(selectedPost?.comments)
    const dispatch = useDispatch()

    useEffect(()=>{
        if(selectedPost){
            setComment(selectedPost?.comments);
        }
    },[selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        setText(inputText.trim() ? inputText : "");
    }

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })

            if (res.data?.success) {
                toast.success(res.data.message);
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                const updatedPostData = posts.map((p) =>
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                )

                dispatch(setPosts(updatedPostData));
                setText("");
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent
                onInteractOutside={() => setOpen(false)}
                className='w-full max-w-5xl p-0 flex flex-col lg:flex-row h-[70vh] lg:max-h-[70vh] lg:h-[70vh] bg-white rounded-lg'
            >
                {/* Left: Post Image */}
                <div className='w-full lg:w-1/2 h-64 lg:h-auto flex-shrink-0'>
                    <img
                        src={selectedPost?.image}
                        alt='post_img'
                        className='w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none'
                    />
                </div>

                {/* Right: Comments & Input */}
                <div className='w-full lg:w-1/2 flex flex-col justify-between'>
                    {/* Header */}
                    <div className='flex items-center justify-between p-4 border-b flex-shrink-0'>
                        <div className='flex gap-3 items-center'>
                            <Link>
                                <Avatar>
                                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className='overflow-hidden'>
                                <Link className='font-semibold text-sm truncate block'>
                                    {selectedPost?.author?.username}
                                </Link>
                            </div>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <MoreHorizontal className='cursor-pointer' />
                            </DialogTrigger>
                            <DialogContent className='flex flex-col items-center text-sm text-center'>
                                <div className='cursor-pointer w-full text-[#ED4956] font-bold'>Unfollow</div>
                                <div className='cursor-pointer w-full'>Add to favourites</div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Comments List */}
                    <div className='flex-1 overflow-y-auto p-4 break-words'>
                        {comment?.map((c) => <Comment key={c._id} comment={c} />)}
                    </div>

                    {/* Input */}
                    <div className='p-4 border-t flex-shrink-0'>
                        <div className='flex items-center gap-2'>
                            <input
                                type='text'
                                placeholder='Add a comment...'
                                className='w-full text-sm outline-none border border-gray-300 p-2 rounded'
                                value={text}
                                onChange={changeEventHandler}
                            />
                            <Button disabled={!text} onClick={sendMessageHandler} variant='outline'>Send</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog