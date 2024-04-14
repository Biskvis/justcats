import React, { useState } from 'react';
import Link from 'next/link';
import { useTimeAgo } from 'next-timeago';
import { Timestamp } from 'firebase/firestore'
import Image from 'next/image';

export default function CommentSection({ handleComment, userInfo, comments }) {

    const { TimeAgo } = useTimeAgo();
    const [visibleComments, setVisibleComments] = useState(5); // Initial number of visible comments
    
    if (comments) {

        comments = comments.slice().reverse()
    }
    // Function to handle click on "See More" button
    const handleSeeMore = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + 5); // Increase the number of visible comments by 5
    };
    
    const displayComments = comments.length > 0 ? (
        <>
            {comments.slice(0, visibleComments).map((item, index) => {
                
                let time;
                if (typeof item.createdAt === 'object' && item.createdAt instanceof Date) {
                    time = item.createdAt;
                } else {
                    const timestamp = new Timestamp(item.createdAt.seconds, item.createdAt.nanoseconds)
                     time = timestamp.toDate()
                 }
                
                return (
                    <div key={index} className="chat chat-end">
                        <div className="chat-header">
                            <TimeAgo date={time} locale='en'/>
                        </div>
                        <div className="chat-image avatar static">
                            <div className="w-12 rounded-full">
                                <Link href={`/users/${item.name}`}>
                                    <Image 
                                        src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${userInfo.uid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`} 
                                        width={200}
                                        height={200}
                                        alt="Avatar"
                                        unoptimized = {true}
                                        onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"}}

                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="chat-bubble static break-words">{item.comment}</div>
                    </div>
                );
            })}
            {comments.length > visibleComments && (
                <button onClick={handleSeeMore} className="text-blue-500 p-2 hover:underline">More Comments...</button>
            )}
        </>
    ) : (
        <p className="text-right p-2">Be the first to comment</p>
    );
    

    return (
        <div className="p-2 bg-slate-300">
            <h3 className="text-center text-xl">Comments</h3>
            {displayComments}
            <hr />
            <form onSubmit={(e) => handleComment(e)} className="flex flex-row p-2 justify-end">
                <button className="btn mr-2" type="submit">Send</button>
                <input type="text" placeholder="Type here" className="chat-bubble static w-full max-w-xs" required maxLength="250" name='comment' />
                <div className="chat-image avatar ml-2 static">
                    <div className="w-12 rounded-full">
                        <Image 
                            src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${userInfo.uid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`} 
                            width={200}
                            height={200}
                            alt="Avatar"
                            unoptimized = {true}
                            onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"}}

                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
