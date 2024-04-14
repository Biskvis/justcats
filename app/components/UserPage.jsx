'use client'
import { useContext } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import Card from './Card';
import { db } from '../firebase/config'
import { updateDoc, arrayUnion, doc } from 'firebase/firestore';

import { MyContext } from '../MyContext';
import { RiUserAddLine } from "react-icons/ri";
import {toast} from 'react-toastify'

export default function UserPage({ data, user }) {
    
    const userData = useContext(MyContext)

    const posts = data.map((item, index) =>
        <div key={index} >
            <div  className='p-4' >
                <Card  title={item.title} desc={item.description} imgUrl={item.imageUrl} uid={item.uid} name={item.name} postId={item.postId} comments={item.comments} createdAt={item.createdAt} />
            </div>
            <div className='border border-custom-dark  w-full mt-12'></div>
        </div>
    )
    
    
    async function handleFriend(name, uid) {
        try {
            const userDocRef = doc(db, 'users', uid);
    
            await updateDoc(userDocRef, {
                notifications: arrayUnion({ type: 'friendRequest', friendUid: userData.uid, friendName: name})
            });
            toast('Friend request sent.')
        } catch (error) {
            console.error('Error updating document:', error);
        }
    }
        
    return (
        <div className="container bg-custom-dark border-4 border-black ">
            <div className='flex flex-col justify-center items-center p-4'>
                <div className="avatar">
                    <div className="w-40 rounded-full">
                        
                    <Image
                        src={user.avatarUrl}
                        width={300}
                        height={300}
                        className='rounded-xl ml-auto'
                        alt='profile-picture'
                    />
                    </div>
                </div>
                <h2 className='text-2xl text-center text-white p-4'>{user.name}</h2>
                {user.bio && 
                    <div className='self-start max-w-md'>
                        <h3 className='text-slate-300 font-bold'>About me:</h3>
                        <p className='text-white word-break'>{user.bio}</p>
                    </div>
                }
                <hr />
                {userData && userData.name !== user.name ? (

                    userData.friends.some(friend => friend.friendName === user.name)  ?
                        <div className="badge badge-secondary self-end  text-xl">friend</div> :
                        <div className='self-end'><button className='btn' onClick={() => handleFriend(userData.name, user.uid)}><RiUserAddLine /> Send A friend Request</button></div>
                )
                    : <Link
                        href="/profile"    
                    >   
                    <div className='self-end'> 
                        <button className='btn'>Edit profile</button>
                    </div>
                    </Link>
                }
            </div>
            <div className='w-full border border-black'></div>
            <div className='grid place-content-center '>
                {data.length < 1 && <h2 className='text-white text-xl p-4'>This user hasn&apos;t posted anything yet.</h2>}
                {posts}
            </div>
        </div>
    )
}