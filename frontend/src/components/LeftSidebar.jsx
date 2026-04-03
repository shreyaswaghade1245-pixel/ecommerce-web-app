import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import instalogo1 from '../assets/instalogo2.png'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'
import CreatePost from './createPost'
import toast from 'react-hot-toast'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { setLikeNotification } from '@/redux/rtnSlice'

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification} = useSelector(store => store.realTimeNotification);


    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notificationOpen1, setNotificationOpen1] = useState(false);
    const [activeTab, setActiveTab] = useState('Home')

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate('/login');
                toast.success(res.data.message)
            }

        }
        catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const sidebarHandler = (textType) => {
        setActiveTab(textType);

        if (textType == 'Logout') {
            logoutHandler();
        }
        else if (textType == 'Create') {
            setOpen(true);
        }
        else if (textType == 'Profile') {
            navigate(`/profile/${user?._id}`)
        }
        else if (textType == 'Home') {
            navigate('/')
        }
        else if (textType == 'Messages') {
            navigate('/chat')
        }
        else if (textType == 'Notifications') {
            notificationOpen ? setNotificationOpen(false) : setNotificationOpen(true);
        }
        
    }

    const sidebarItems = [
        { icon: <Home />, text: 'Home' },
        { icon: <Search />, text: 'Search' },
        { icon: <TrendingUp />, text: 'Explore' },
        { icon: <MessageCircle />, text: 'Messages' },
        { icon: <Heart />, text: 'Notifications' },
        { icon: <PlusSquare />, text: 'Create' },
        {
            icon: (
                <Avatar className='h-6 w-6'>
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || "CN"}</AvatarFallback>
                </Avatar>
            ),
            text: 'Profile'
        },
        { icon: <LogOut />, text: 'Logout' },
    ]

    return (
        <>
            <div className='md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b z-20 flex items-center justify-center'>
                <img src={instalogo1} alt="logo" className='h-12' />
                <Heart className='absolute right-4 cursor-pointer' onClick={()=>notificationOpen1 ? setNotificationOpen(false) : setNotificationOpen(true)} />
                
                {likeNotification.length > 0 && (
                    <Popover open={notificationOpen1} onOpenChange={(open) => {
                        setNotificationOpen(open)
                        }}>
                        <PopoverTrigger asChild >
                            <Button
                                size='icon'
                                className='rounded-full h-4 w-4 absolute top-2.5 right-2.5 lg:right-42.5 bg-red-600 hover:bg-red-600 text-xs'
                            >
                                {likeNotification.length}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div>
                                {likeNotification.length == 0 ? (
                                    <p>No new notification</p>
                                ) : (
                                    likeNotification.map((notification) => {
                                        return (
                                            <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                <Avatar>
                                                    <AvatarImage src={notification.userDetails?.profilePicture} />
                                                    <AvatarFallback>CN</AvatarFallback>
                                                </Avatar>
                                                <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p> </div>
                                        )
                                    }
                                    )
                                )
                                }
                            </div>
                        </PopoverContent>
                    </Popover>
                )
                }
            </div>

            <div className='
                fixed z-10 
                md:top-0 md:left-0 md:px-4 md:border-r md:border-gray-300 md:w-[16%] md:h-screen
                bottom-0 left-0 right-0 md:fixed
                bg-white
                md:flex md:flex-col
                flex justify-center 
                border-t md:border-t-0
            '>

                <div className='hidden md:flex my-2'>
                    <img src={instalogo1} alt="" className='h-20 w-40' />
                </div>

                <div className='flex md:flex-col w-full justify-around md:justify-start ml-1.5'>
                    {sidebarItems.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => sidebarHandler(item.text)}
                            className={`
                                flex items-center gap-3
                                md:h-15 w-48 relative md:my-1
                                hover:bg-gray-100 cursor-pointer 
                                rounded-lg p-3
                                flex-col md:flex-row
                                ${item.text == 'Notifications' ? 'hidden md:flex' : ''}
                                ${activeTab == item.text ? 'bg-gray-100':''}
                            `}
                        >
                            {item.icon}
                            <span className='hidden md:inline'>{item.text}</span>

                            {item.text == 'Notifications' && likeNotification.length > 0 && (
                                <Popover open={notificationOpen} onOpenChange={(open) => setNotificationOpen(open)} className='hidden lg:block'>
                                    <PopoverTrigger asChild >
                                        <Button
                                            size='icon'
                                            className='rounded-full h-4 w-4 absolute top-2.5 right-2.5 lg:right-42.5 bg-red-600 hover:bg-red-600 text-xs'
                                        >
                                            {likeNotification.length}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <div>
                                            {likeNotification.length == 0 ? (
                                                <p>No new notification</p>
                                            ) : (
                                                likeNotification.map((notification) => {
                                                    return (
                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                            <Avatar>
                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                <AvatarFallback>CN</AvatarFallback>
                                                            </Avatar>
                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p> </div>
                                                    )
                                                }
                                                )
                                            )
                                            }
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )
                            }
                        </div>
                    ))}
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </>
    )
}



export default LeftSidebar
