import LeftSidebar from './LeftSidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import Home from './Home'

const MainContainer = () => {
    return (
    <div className="flex min-h-screen bg-white">
      
      <LeftSidebar />

      <div className="flex-1 pt-14 md:pt-6 pb-16 md:pb-6">
        <Outlet />
      </div>

    </div>
  )
}

export default MainContainer
