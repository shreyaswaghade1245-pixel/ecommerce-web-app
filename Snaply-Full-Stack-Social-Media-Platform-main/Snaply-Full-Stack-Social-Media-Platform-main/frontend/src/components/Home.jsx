import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  
  return (
    <div className="flex justify-between w-full">

      <div className="flex-1 flex justify-center ">
        <div className="w-full max-w-157.5">
          <Feed />
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:block w-125 pr-10">
        <RightSidebar />
      </div>

    </div>
  )

}

export default Home
