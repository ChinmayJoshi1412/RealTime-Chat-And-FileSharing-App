import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className='flex flex-col p-10 justify-center items-center bg-gradient-to-tl from-blue to-lightTeal h-screen'>
        <div className='h-2/3 bg-white w-3/4 lg:w-1/2 rounded-xl drop-shadow-xl'>
        <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout