
import './App.css'
import Login from './components/Login'
import Signup from './components/SignUp'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainContainer from './components/MainContainer'
import Profile from './components/Profile'
import Home from './components/Home'
import ChatPage from './components/ChatPage'
import { io } from 'socket.io-client'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setFollowNotification, setLikeNotification } from './redux/rtnSlice'
import ProtectedRoutes from './components/ProtectedRoutes'
import EditProfile from './components/EditProfile'

function App() {
  const dispatch = useDispatch();
  
  const { user } = useSelector(store => store.auth);
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (user && !socketRef.current) {
      const socketio = io('http://localhost:8000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      socketRef.current = socketio; 

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      })

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      })

      socketio.on('follownotification',(follownotification)=>{
        dispatch(setFollowNotification(follownotification));
      })

      return () => {
        socketio.disconnect();
        socketRef.current = null;
      };
    }
  
  }, [user, dispatch])

  return (
    <>
      <Routes>
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ProtectedRoutes><MainContainer /></ProtectedRoutes>}>
          <Route path='/' element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
          <Route path='/profile/:id' element={<ProtectedRoutes><Profile /></ProtectedRoutes>} />
          <Route path='/account/edit' element={<ProtectedRoutes><EditProfile /></ProtectedRoutes>} />
          <Route path='/chat' element={<ProtectedRoutes><ChatPage socket={socketRef.current} /></ProtectedRoutes>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
