'use client'

import { useState } from 'react';

import isAuth from "@/app/components/isAuth.tsx";
import Sidebar from './components/Sidebar'
import Content from './components/Content'
import FavoritesSidebar from './components/FavoritesSidebar'
import { ToastContainer, toast } from 'react-toastify';


function Home() {

  const [post, setPost] = useState(false)
  const [sidebar, setSidebar] = useState(false)
  const [rightSidebar, setRightSidebar] = useState(false)
  
  return (
    <div className='flex flex-row container mx-auto bg-custom-dark'>
      <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
      <Sidebar setPost={setPost} sidebar={sidebar}/>
      <Content post={post} setPost={setPost} setSidebar={setSidebar} setRightSidebar={setRightSidebar} rightSidebar={rightSidebar}/>
      <FavoritesSidebar rightSidebar={rightSidebar} /> 

    </div>
  )
}

export default isAuth(Home);