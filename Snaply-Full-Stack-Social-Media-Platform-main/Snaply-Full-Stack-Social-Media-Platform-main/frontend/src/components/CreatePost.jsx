import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from "@/components/ui/textarea"
import { Button } from './ui/button'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { setPosts } from '@/redux/postSlice'

const CreatePost = ({ open, setOpen }) => {
    const imgRef = useRef()
    const [file, setFile] = useState("")
    const [caption, setCaption] = useState("")
    const [imgPreview, setImgPreview] = useState("")
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImgPreview(dataUrl)
        }
    }

    const createPostHandler = async (e) => {
        const formData = new FormData();
        formData.append('caption', caption);
        if (imgPreview) formData.append('image', file);
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data?.success) {
                dispatch(setPosts([res.data.post, ...(posts || [])]))
                toast.success(res.data.message);
                setOpen(false);
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)}>
                <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
                <div className='flex gap-3 items-center'>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt='img' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold text-xs'>{user?.username}</h1>
                        <span className='text-xs text-gray-600'>Bio here...</span>
                    </div>
                </div>
                <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className='focus-visible:ring-transparent border-none' placeholder='Write a caption...' />
                {
                    imgPreview && (
                        <div className='w-full h-64 flex items-center justify-center'>
                            <img src={imgPreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                        </div>
                    )
                }
                <input ref={imgRef} type="file" className='hidden' onChange={fileChangeHandler} />
                <Button onClick={() => imgRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#067ccb] cursor-pointer'>Select from computer</Button>
                {
                    imgPreview && (
                        loading ? (
                            <Button>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Please wait
                            </Button>
                        ) : (
                            <Button onClick={createPostHandler} type='submit' className='w-full hover:cursor-pointer'>Post</Button>
                        )
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
