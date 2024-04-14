'use client'

import {useEffect, useState, useContext} from 'react';

import { signOut } from 'firebase/auth';
import { auth, db } from '@/app/firebase/config'
import { doc, getDoc } from "firebase/firestore"; 

import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link';
import clsx from 'clsx';

import { IoHomeSharp } from "react-icons/io5";
import { MdFavorite } from "react-icons/md";
import { AiFillProfile } from "react-icons/ai";
import { FaMessage } from "react-icons/fa6";
import { IoLogOutSharp } from "react-icons/io5";
import { MdOutlinePostAdd } from "react-icons/md";


import { MyContext } from '../MyContext';
import MessageContacts from './MessageContacts'


export default function Sidebar(props) {

    const userData = useContext(MyContext);
    const pathname = usePathname()
    const router = useRouter()

    const [chat, setChat] = useState(false)
    
    const handleLogout = () => {
        signOut(auth)
          .then(() => {
            console.log('signedout')
          })
          .catch(error => {
            console.error('Error logging out:', error);
          });
      };

    return (
        <div className={`border-r-4 border-black md:w-72 w-20  max-w-xs md:block duration-500 ${pathname === '/' && (props.sidebar === true ? '' : 'hidden')}`}>
            <div className="sticky top-0 h-96 border-r-4 border-black">
            <div className=''>

            <h1 className='text-center p-2 bg-gradient-to-r from-amber-600 via-amber-500 to-white inline-block text-transparent bg-clip-text md:text-4xl text-sm  font-bold'>JustCats</h1>
            <div className='avatar grid place-content-center'>
                
                    <div className='md:w-24 w-12 rounded-xl' >
                        <Link href={`/users/${userData && userData.name}`}>
                        <Image
                            src={userData && userData.avatarUrl ? userData.avatarUrl : '/cat-profile.png'} 
                            width={100}
                            height={30}
                            className='object-cover rounded-full border'
                            alt='avatar picture'
                        />
                        </Link>
                    </div>
                </div>
                <p className='font-semibold p-2 text-white md:text-xl text-center'>{userData && userData.name}</p>
                <div className={clsx(
                    'text-2xl md:text-xl p-2 border-t text-white border-b-4 border-black hover:text-amber-500 hover:bg-custom-dark1 duration-500', {
                        'font-bold hover:text-white' : pathname === '/',
                    }
                )}>

                <Link href='/' > <div className='flex justify-center md:justify-start items-center'><IoHomeSharp /><span className='ml-2 hidden md:block'>Home</span></div></Link>
                
                </div>
                <div className={clsx(
                    'text-2xl md:text-xl p-2 border-t text-white border-b-4 border-black hover:text-amber-500 hover:bg-custom-dark1 duration-500', {
                        'font-bold  hover:text-white' : pathname === '/favorites',
                    }
                )}>

                <Link href='/favorites' ><div className='flex justify-center md:justify-start items-center'><MdFavorite /><span className='ml-2 hidden md:block'>Favorites</span></div></Link>
                
                </div>
                <div className={clsx(
                    'text-2xl md:text-xl p-2 border-t text-white border-b-4 border-black hover:text-amber-500 hover:bg-custom-dark1 duration-500', {
                        'font-bold  hover:text-white' : pathname === '/profile',
                    }
                )}>

                <Link href='/profile' ><div className='flex justify-center md:justify-start items-center'><AiFillProfile /><span className='ml-2 hidden md:block'>Profile</span></div></Link>
                
                </div>
                
            
                <div className='flex justify-center md:justify-end p-2'>
                <button className='btn btn-xs  md:btn-sm' onClick={handleLogout}>
                   <span className='md:hidden text-2xl'>
                        <IoLogOutSharp />
                    </span> 

                    <span className='hidden md:block'>
                    Log out
                    </span>
            </button>

                </div>
            </div>
            <div className='sticky -top-96 flex flex-col justify-center p-2 md:p-0 md:block '>
                {pathname === '/' &&
                    <button className='btn btn-sm md:btn-md btn-warning mt-4 md:w-full'
                    onClick={() => props.setPost(prevState => !prevState)}
                >
                    <span className='md:hidden text-2xl'>

                        <MdOutlinePostAdd />
                    </span>
                    <span className='hidden md:block'>
                        New Post
                        </span>
                </button>
                }
                    <div className='border-b-4 border-black mt-2'></div>
                    <button className={`text-2xl md:text-xl my-2 md:p-2 self-center flex md:flex-row md:gap-2 ${chat === true ? 'text-amber-500' : 'text-white'}`} onClick={() => setChat(prevChat => !prevChat)}><FaMessage /> <span className='hidden md:block ml-2'>Messages</span></button>
                    <div className='border-b-4  border-black'></div>
                {chat &&
                    <MessageContacts userData={userData} />
                }
            </div>
            </div>
        </div>
    )
}

