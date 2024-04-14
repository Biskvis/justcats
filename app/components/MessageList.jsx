import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import io from 'socket.io-client';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import MessageForm from './MessageForm'

const socket = io('https://socket-w8ur.onrender.com');

const MessageList = ({ userData, otherUser }) => {

    const chatContainerRef = useRef(null);
    const [messages, setMessages] = useState([]);


    useEffect(() => {
        // Scroll to the bottom of the chat container
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);
    

  useEffect(() => {
    // Define the conversation identifier (example: combination of user IDs)
    let conversationId;
    if (userData.uid < otherUser.friendUid) {
        conversationId = userData.uid + otherUser.friendUid;
    } else {
        conversationId = otherUser.friendUid + userData.uid;
    }

    // Retrieve messages for the conversation from the database
    const fetchMessages = async (conversationId) => {
        const conversationRef = doc(db, 'conversations', conversationId);
        
        try {
          const conversationSnapshot = await getDoc(conversationRef);
          if (conversationSnapshot.exists()) {
            const conversation = conversationSnapshot.data();

            const messages = conversation.messages; // Corrected
            
            setMessages(messages);
            
          } else {
            console.log('Conversation not found');
            await setDoc(conversationRef, {
                messages: [],
                conversationId: conversationId
            })
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      

    fetchMessages(conversationId);

    // Listen for incoming messages from the server for the specific conversation
    socket.on('message', data => {
      if (data.conversationId === conversationId) {
        setMessages(prevMessages => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('message');
    };
  }, [userData.uid, otherUser.friendUid]);
  return (
    <div>
        <div className='flex flex-col justify-center items-center p-2'>
            <div className="avatar">
                    <div className="w-20 rounded-full border">
                        <Image 
                            src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${otherUser.friendUid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`}
                            width={300}
                            height={300}
                            alt='profile pic'
                            unoptimized = {true}
                            onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"}}
                        />
                    </div>
            </div>
            <h2 className='text-amber-500 text-xl'>{otherUser.friendName}</h2>
        </div>
            <hr />
      <div className='overflow-y-auto max-h-60 scrollbar bg-custom-dark1' ref={chatContainerRef}>
      {messages.map((message, index) => (
            <div key={index} className={`chat ${message.sender === userData.name ? 'chat-end mb-2' : 'chat-start'}`}>
                <div className="chat-header text-amber-500">{message.sender === userData.name ? 'You' : message.sender}</div>
                <div className="chat-bubble break-words">{message.content}</div>
            </div>
        ))}
        
      </div>
        <MessageForm currentUser={userData} otherUser={otherUser}/>
    </div>
  );
};

export default MessageList;
