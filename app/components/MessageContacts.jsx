'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '../firebase/config'
import { collection, query, orderBy, getDocs} from 'firebase/firestore'

import { useTimeAgo } from 'next-timeago';

import MessageList from './MessageList'

export default function MessageContacts({userData}) {

    const [chatting, setChatting] = useState(false)
    const [otherUser, setOtherUser] = useState({})
    const [recent, setRecent] = useState(true)
    const [chats, setChats] = useState([])
    const { TimeAgo } = useTimeAgo();

    function handleChat(item) {
        setOtherUser(item)
        setChatting(true)
    }

    useEffect(() => {
        
        async function fetchRecent() {

            const messagesCollection = collection(db, 'conversations');
            const q = query(messagesCollection, orderBy('timestamp', 'desc'));
            const res = await getDocs(q)
            const data = res.docs.map(doc => doc.data());
            const chats = [];

            data.forEach(item => {
                const lastMessage = item.messages[item.messages.length - 1];
                const friend = userData.friends.find(friend => friend.friendUid === item.conversationId.replace(userData.uid, ''));
                const timestamp = item.timestamp
                if (friend) {
                    friend.lastMessage = lastMessage.content;
                    friend.timestamp = timestamp
                    chats.push(friend);
                }
            });

            setChats(chats);


        }
        if (recent === true) {

            fetchRecent()
        } else {
            setChats(userData.friends)
        }

    }, [recent])

    
    const displayChats = chats.map((item, index) => {
        let imageUrl = `https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${item.friendUid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`;
    
        return (
            <div key={index} className='p-2 flex flex-row gap-4 items-center border border-black hover:bg-custom-dark duration-500 cursor-pointer' onClick={() => handleChat(item)}>
                <div className="avatar">
                    <div className="w-12 rounded-full">
                    <Image 
                            src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${item.friendUid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`}
                            width={300}
                            height={300}
                            alt='profile pic'
                            unoptimized = {true}
                            onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"
                        }}
                        />
                    </div>
                </div>
                <div className='flex flex-col'>
                    {item.lastMessage ? (
                        <div>
                            <div className='grid grid-cols-2'>
                                <p className='text-amber-500 text-xl'>{item.friendName}</p>
                                <TimeAgo date={item.timestamp.toDate()} locale='en'/>
                            </div> 
                            <p className='text-sm max-w-20 truncate'>{item.lastMessage}</p>
                        </div>
                    ) : (
                        <p className='text-amber-500 text-xl'>{item.friendName}</p>
                    )}
                </div>
            </div>
        );
    });
    

    return (
        <div className='bg-custom-dark1 w-[16rem] md:w-full text-white h-96 flex flex-col border border-black rounded-lg'>
            <div className='join'>
                <button className={`join-item btn w-1/2 ${recent === true && 'btn-neutral'}`} onClick={() => { setRecent(true); setChatting(false); }}>Recent</button>
                <button className={`join-item btn w-1/2 ${recent === false && 'btn-neutral'}`} onClick={() => { setRecent(false); setChatting(false); }}>All</button>
            </div>
            {chatting ? <MessageList userData={userData} otherUser={otherUser}/> :
            <div className='overflow-y-auto scrollbar'>
                {displayChats.length > 0 ? displayChats : <p className='p-2 word-break'>Add a friend to message someone.</p>}
            </div>
            
            }
        </div>
    )
}