'use client'
import Sidebar from '../components/Sidebar';
import isAuth from "@/app/components/isAuth.tsx";
import ProfileForm from '../components/ProfileForm';
import { ToastContainer } from 'react-toastify'

 function Profile() {
    return (
        <div className='flex flex-row container mx-auto bg-custom-dark'>
            <ToastContainer />
            <Sidebar />
            <ProfileForm />        
        </div>
    )
}

export default isAuth(Profile);