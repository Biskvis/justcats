'use client'

import { useState, useEffect} from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { db } from '../firebase/config'
import { getDocs, orderBy, query, collection, startAt, endAt, limit} from 'firebase/firestore'

import { useTimeAgo } from 'next-timeago';

export default function Search() {

    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState({})
    const [typingTimeout, setTypingTimeout] = useState(null);
    const { TimeAgo } = useTimeAgo();
    
    useEffect(() => {
        // Clear previous timeout to avoid unnecessary queries
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        // Set a new timeout for debounce
        const timeout = setTimeout(() => {
            const searchUsersQuery = query(collection(db, 'users'), orderBy("name_lowerCase"), startAt(search), endAt(search + "\uf8ff"), limit(5))
            const searchPostsQuery = query(collection(db, 'posts'), orderBy("title_lowerCase"), startAt(search), endAt(search + "\uf8ff"), limit(5))
            
            
            async function searchItems() {
                if (search) {

                    try {
                        const usersSnapshot = await getDocs(searchUsersQuery);
                        const users = usersSnapshot.docs.map(doc => doc.data());
    
                        const postsSnapshot = await getDocs(searchPostsQuery);
                        const posts = postsSnapshot.docs.map(doc => doc.data());
    
                        setSearchResults({ users, posts });
                    } catch (error) {
                        console.error('Error searching items:', error);
                    }
                }
            }

            searchItems();
        }, 1500); 

        setTypingTimeout(timeout);
        
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [search]);

    const userResults = searchResults.users?.map((item, index) => 
    <li key={index}>
        <Link className='hover:bg-custom-dark' href={`/users/${item.name}`}>
            <div className='avatar'>
                <div className='w-12 rounded-full'>

                <Image
                    src={item.avatarUrl}
                    width={20}
                    height={20}
                    alt='profile pic'
                />
                </div>
            </div>
            <p className='text-amber-500 text-xl p-2 '>

                {item.name}
            </p>
        </Link></li>
    )

    const postResults = searchResults.posts?.map((item, index) => 
    <li key={index}>
        <Link href={`/posts/${item.postId}`} className='text-white text-xl hover:bg-custom-dark'>
            {item.title}
            <TimeAgo date={item.createdAt.toDate()} locale='en'/>
        </Link></li>
    )
    return (
        <div className='join-item dropdown dropdown-hover md:w-full  duration-500'>
            <label className="input input-bordered bg-slate-800 flex items-center gap-2">
                <input type="text" className="grow text-xl text-white placeholder-white w-44 md:w-full" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value.toLowerCase())} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70 text-white"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
            {searchResults && 
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-custom-dark1 rounded-box w-full duration-500">
                    <h2 className='text-center text-xl text-white'>Users</h2>
                    <hr />
                { userResults && userResults.length > 0 ? userResults : <li className='text-white p-2'>No users fit the criteria.</li>
                }
                    <h2 className='text-center text-xl text-white'>Posts</h2>
                    <hr />
                {
                    postResults && postResults.length > 0 ? postResults : <li className='text-white p-2'>No posts fit the criteria.</li>
                }
              </ul>
            }
        </div>
    )
}