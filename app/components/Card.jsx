'use client'

import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { MyContext } from '../MyContext';

import Image from 'next/image';
import Link from 'next/link'

import { CiHeart } from "react-icons/ci";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";


import { auth, db } from '../firebase/config'
import { updateDoc, doc, getDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";

import { useTimeAgo } from 'next-timeago';
import CommentSection from './CommentSection'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Card(props) {

    const [ comments, setComments ] = useState(props.comments || [])
    const userInfo = useContext(MyContext);
    const [ comment, setComment ] = useState(false)
    const [favorites, setFavorites] = useState([]);
    const { TimeAgo } = useTimeAgo();
    let time = props.createdAt

    useEffect(() => {
        if (userInfo && userInfo.favorites) {
            setFavorites(userInfo.favorites);
        }
    }, [userInfo]);

    async function handleClick(postId) {
        const user = userInfo
        if (user) {
            try {
                const docRef = doc(db, 'posts', props.postId)   
                const userDocRef = doc(db, 'users', userInfo.uid)
                if (favorites.includes(postId)) {
                    await updateDoc(userDocRef, {
                        favorites: arrayRemove(postId)
                    });
                    await updateDoc(docRef, {
                        favoriteCount: increment(-1)
                    })
                    setFavorites(prevState => prevState.filter(item => item !== postId));
                    toast("Removed from favorites.", {
                        autoClose: 1500
                    });
                    }
                else {
                    await updateDoc(userDocRef, {
                        favorites: arrayUnion(postId)
                    });
                    await updateDoc(docRef, {
                        favoriteCount: increment(1)
                    })
                    setFavorites(prevState => [...prevState, postId])
                    toast("Added to favorites.");
                    console.log("Favorites updated successfully");
                }
            } catch (error) {
                console.error("Error updating favorites: ", error);
            }
        } else {
            console.error("No user is signed in.");
        }
    }

     async function handleComment(event) {
        event.preventDefault();
        const commentText = event.target.comment.value
        const docRef = doc(db, 'posts', props.postId)
        const userRef = doc(db, 'users', props.uid)
        const createdAt = new Date();

        try {
            await updateDoc(docRef, {
                comments: arrayUnion({name: userInfo.name, comment: commentText, uid: userInfo.uid, createdAt: createdAt })
            })
            if (props.uid !== userInfo.uid) {
                await updateDoc(userRef, {
                    notifications: arrayUnion({type: 'comment', post: props.postId})
                })
            }
            event.target.comment.value = '';
            setComments(prevState => [...prevState, {name: userInfo.name, comment: commentText, uid: userInfo.uid, createdAt: createdAt}])
        } catch(error) {
            console.log(error)
        }

    }
    
    if (typeof(props.createdAt) === 'object') {
        time = time.toDate()
    }


    return (
        <div className='bg-slate-300 md:w-[32rem] rounded-lg md:mt-12 shadow-2xl'>
            <div className='flex flex-row p-2'>
                <div className='flex flex-col'>

                    <Link 
                        href={`/posts/${props.postId}`}
                        className='hover:text-white'
                    >
                        <p className=' text-2xl p-2 font-bold'>{props.title}</p>
                    </Link>
                    <p className='pl-2 -mt-2 text-custom-dark'>{props.createdAt && <TimeAgo date={time} locale='en'/>}</p>
                </div>
                <div className='ml-auto flex flex-col hover:scale-110 tooltip static' data-tip={props.name}>

                        <Link
                            href={`/users/${props.name}`}
                        >
                        
                            <Image
                                src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${props.uid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`}
                                width={80}
                                height={30}
                                className='object-cover rounded-full h-16 w-16 md:w-20 md:h-20 border border-black'
                                alt='avatar picture'
                                unoptimized = {true}
                                onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"}}
                            />
                        </Link>
                        
                </div>
            </div>
            <Image
                src={props.imgUrl}
                width={600}
                height={200}
                className='rounded-lg object-cover object-center max-h-96'
                alt={props.title}
            />
            <div className='bg-slate-100'>

                <p className='p-4 text-xl'>{props.desc}</p>
                <div className='flex flex-row p-2'>

                    <button className='btn btn-primary btn-md  md:text-3xl rounded-full tooltip static hover:scale-100' data-tip='Favorite' onClick={() => handleClick(props.postId)}>
                    {favorites && favorites.includes(props.postId) ? <FaHeart /> : <CiHeart />}</button>
                    <button className='btn btn-secondary btn-md  ml-auto md:text-3xl tooltip static hover:scale-100' data-tip={`Comment`} onClick={() => setComment(!comment)}><FaComment /></button>
                    </div>
                    {comment && 
                        <CommentSection handleComment={handleComment} userInfo={userInfo} comments={comments} />
                    }
            </div>
        </div>
    )
}