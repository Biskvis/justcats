import React, { useState } from 'react';
import io from 'socket.io-client';
import { db } from '../firebase/config'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore'

const socket = io('https://socket-w8ur.onrender.com');

const MessageForm = ({ currentUser, otherUser }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const handleMessageSubmit = async event => {
    event.preventDefault();

    // Define the conversation identifier (example: combination of user IDs)
    let conversationId;
    if (currentUser.uid < otherUser.friendUid) {
        conversationId = currentUser.uid + otherUser.friendUid;
    } else {
        conversationId = otherUser.friendUid + currentUser.uid;
    }
    const docRef = doc(db, 'conversations', conversationId)
    // Emit the message to the server for broadcasting
    socket.emit('message', {
      conversationId: conversationId,
      sender: currentUser.name,
      content: message
    });
    
    // Save the message to the database
    try {
      await updateDoc(docRef, {
        timestamp: new Date(),
        messages: arrayUnion({
            sender: currentUser.name,
            content: message})
      });
      console.log('Message saved to the database:', message);
    } catch (error) {
      console.error('Error saving message to the database:', error);
    }

    // Clear the message input field
    setMessage('');
  };

  return (
    <form onSubmit={handleMessageSubmit} className='join'>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message..."
        className='text-black join-item input input-bordered input-md w-full max-w-xs'
        maxLength={150}
      />
      <button type="submit" className='join-item btn btn-secondary w-14'>Send</button>
    </form>
  );
};

export default MessageForm;
