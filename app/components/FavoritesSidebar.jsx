'use client'
import { useState, useContext, useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { MyContext } from '../MyContext';
import FriendsSidebar from './FriendsSidebar'
import NotificationsSidebar from './NotificationsSidebar'
import DisplayFriendsPagination from './FriendsPagination'
import { arrayRemove, arrayUnion, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config'

export default function FavoriteSidebar(props) {

    const user = useContext(MyContext)
    const [popOut, setPopOut] = useState(false)
    const [show, setShow] = useState(1)
    const [lastShow, setLastShow] = useState(1)
    const [notifications, setNotifications] = useState([])
    const [displayRequests, setDisplayRequests] = useState('')

    useEffect(() => {
        if (user && user.notifications) {
            setNotifications(user.notifications);
        }
    }, [user]);

    useEffect(() => {

        if( notifications.length > 0 ) 
            {
                setDisplayRequests(notifications.map((item, index) => 
            
                    <NotificationsSidebar 
                        key={index} 
                        type={item.type} 
                        friendName={item.friendName} 
                        friendUid={item.friendUid} 
                        index={index} 
                        handleRequest={handleRequest}
                        message={item.message}
                        deleteNotification={deleteNotification}
                        post={item.post}
                        count={item.count}
                        deleteCommentNotification={deleteCommentNotification}
                    />
                ))
                
            }
        else {
            setDisplayRequests(<p className='text-white p-2'>No new notifications.</p>)
        }
    }, [notifications])
    

    const displayFriends = user && user.friends ? user.friends.map((item, index) => {
    
        return (
            <FriendsSidebar key={index} friendName={item.friendName} friendUid={item.friendUid} />
        );
    }) : <p>Add friends</p>;
    

    async function handleRequest(status, friendUid, friendName, reqIndex) {
        const docref = doc(db, 'users', user.uid);
        const friendRef = doc(db, 'users', friendUid);
    
        if (status === 1) {
            await updateDoc(docref, {
                friends: arrayUnion({ friendName: friendName, friendUid: friendUid }),
                notifications: arrayRemove({ type: 'friendRequest', friendName: friendName, friendUid: friendUid })
            });
            await updateDoc(friendRef, {
                friends: arrayUnion({ friendName: user.name, friendUid: user.uid }),
                notifications: arrayUnion({ type: 'notification', message: `${user.name} accepted your request.`})
            });
            setNotifications(prevState => prevState.filter((item, index) => index !== reqIndex))
            
            console.log('friend added')
        } else if (status === 2) {
            await updateDoc(docref, {
                notifications: arrayRemove({ type: 'friendRequest', friendName: friendName, friendUid: friendUid })
            });
            setNotifications(prevState => prevState.filter((item, index) => index !== reqIndex))
        }
    }

    async function deleteNotification(message, notifIndex, post, count) {
        const docref = doc(db, 'users', user.uid);
        await updateDoc(docref, {
            notifications: arrayRemove({type: 'notification', message: message})
        })
        setNotifications(prevState => prevState.filter((item, index) => index !== notifIndex))
    }

    async function deleteCommentNotification(notifIndex, post) {
        const docref = doc(db, 'users', user.uid);
        await updateDoc(docref, {
            notifications: arrayRemove({type: 'comment',  post: post})
        })
        setNotifications(prevState => prevState.filter((item, index) => index !== notifIndex))
    }
    return (
        <div onMouseOver={() => setPopOut(true)} onMouseOut={() => setPopOut(false)}  className={clsx(
            " md:block md:sticky top-0 w-48 h-[100vw] bg-custom-dark border-l-4 border-black  transition duration-500",
                { 'md:bg-custom-dark1 duration-500': popOut},
                { 'hidden': !props.rightSidebar},
                { '': props.rightSidebar} 
            )}>

            <h2 
                className={`cursor-pointer text-2xl text-center text-white p-2 hover:text-amber-500 hover:bg-custom-dark1 duration-500 ${show === 1 && 'bg-custom-dark1 font-bold'}`}
                onClick={() => {
                    setShow(1);
                    setLastShow(1);
                }}            
                onMouseOver={() => setShow(1)}
                onMouseOut={() => setShow(lastShow)}
                >Friends</h2>
            <h2 
                className={`cursor-pointer text-2xl text-center text-white p-2 hover:text-amber-500 hover:bg-custom-dark1 duration-500 ${show === 2 && 'bg-custom-dark1 font-bold'}`} 
                onClick={() => {
                    setShow(2);
                    setLastShow(2);
                }}
                onMouseOver={() => setShow(2)}
                onMouseOut={() => setShow(lastShow)}
                >
                    <div className="indicator">
                        {notifications.length > 0 &&
                            <span className="indicator-item  badge badge-secondary">{notifications.length}</span>
                        }
                    Notifications
                    </div>
                    
                    </h2>
            {show === 2 && <div className='max-h-96 overflow-y-auto scrollbar'>{displayRequests}</div> }
            {user && show === 1 && <DisplayFriendsPagination user={user} /> }
        </div>
    )
}