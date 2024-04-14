'use client'

import { useState, useEffect  } from 'react';

import Card from './Card';
import PostForm from './PostForm';
import Search from './Search';
import InfiniteScroll from 'react-infinite-scroll-component';

import { db } from '../firebase/config'
import { collection, query, limit, getDocs, orderBy, where, startAt, endAt } from "firebase/firestore";
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore'


export default function Content(props) {

    // queries
    const newestq = query(collection(db, "posts"), orderBy('createdAt', 'desc'), limit(5))
    const favoriteq = query(collection(db, "posts"), orderBy('favoriteCount', 'desc'), limit(5))
    // new post
    const [post, setPost] = useState(false)
    const [refreshLoad, setRefreshLoad] = useState(false)
    
    // infinite scroll, posts
    const [displayPosts, setDisplayPosts] = useState('')
    const [lastItem, setLastItem] = useState('')
    const [hasMore, setHasMore] = useState(true)
    const [sort, setSort] = useState({ sort: 'newest', q: newestq})
    
    // search
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState('')
    const [typingTimeout, setTypingTimeout] = useState(null);

    // posts
    const [postsData, loading, error, snapshot, reload] = useCollectionDataOnce(sort.q);
    
    
    useEffect(() => {
        // Clear previous timeout to avoid unnecessary queries
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        // Set a new timeout for debounce
        const timeout = setTimeout(() => {
            const searchUsersQuery = query(collection(db, 'users'), orderBy("name"), startAt(search), endAt(search + "\uf8ff"))
            const searchPostsQuery = query(collection(db, 'posts'), orderBy("title"), startAt(search), endAt(search + "\uf8ff"))
            
            
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
    
    useEffect(() => {
        if (postsData && postsData.length > 0) {
            const display = postsData.map((item, index) => (
                <div key={index} className='hover:bg-amber-500 duration-500'>
                    <div className='md:p-4'>
                        <Card
                            title={item.title}
                            desc={item.description}
                            imgUrl={item.imageUrl}
                            uid={item.uid}
                            name={item.name}
                            postId={item.postId}
                            createdAt={item.createdAt}
                            comments={item.comments}
                        />
                    </div>
                    <div className='border-4 border-black w-full mt-12'></div>
                </div>
            ));
            
            // Set lastItem based on the sort criteria
            if (sort.sort === 'newest') {
                setLastItem(postsData[4].createdAt);
            } else {
                setLastItem(postsData[4].favoriteCount);
            }
    
            setDisplayPosts(display);
        }
        console.log('times')
    }, [postsData, refreshLoad]);
    


    function reloadPage() {
        reload()
        setRefreshLoad(prevState => !prevState)
    }

    async function fetchData() {
        let q ;
        if (sort.sort === 'newest') {
            q = query(collection(db, "posts"), where('createdAt', '<', lastItem), orderBy('createdAt', 'desc'), limit(5))
        } else {
            q = query(collection(db, "posts"), where('favoriteCount', '<', lastItem), orderBy('favoriteCount', 'desc'), limit(5))
        }
        try {
            
            const getPosts = await getDocs(q)
            if (!getPosts.empty) {
                const morePosts = getPosts.docs.map((doc) => {
                    const item = doc.data();
                    sort.sort === 'newest' ? setLastItem(item.createdAt) : setLastItem(item.favoriteCount)  
                    return (
                        <div key={item.postId} className='hover:bg-amber-500 duration-500 '>
                            <div className='md:p-4' >
                                <Card
                                    title={item.title}
                                    desc={item.description}
                                    imgUrl={item.imageUrl}
                                    uid={item.uid}
                                    name={item.name}
                                    postId={item.postId}
                                    createdAt={item.createdAt}
                                    comments={item.comments}
                                />
                            </div>
                            <div className='border-4 border-black w-full mt-12'></div>
                        </div>
                    );
                });
                setTimeout(() => {

                    setDisplayPosts((prevState) => [...prevState, ...morePosts]);
                }, 1500)
            } else {
                setHasMore(false)
            }
        } catch(error) {
            console.log(error)
        }

    }

    function handleSort(setting) {
        if (setting === 1) {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
            setSort({ sort: 'newest', q: newestq });
            setHasMore(true);
            setLastItem('');
            reload();
        }
        if (setting === 2) {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top of the page
            setSort({ sort: 'favorite', q: favoriteq });
            setHasMore(true);
            setLastItem('');
            reload();
        }
    }
    

    return (
        <div className={`bg-custom-dark`}>
            <div className='sticky top-0 md:w-[34rem] bg-custom-dark border-b-4 border-r-4 border-black hover:bg-custom-dark1 duration-500'>
                <div className={`md:p-12 flex justify-center items-center p-2 join`}>
                    <button className={`join-item btn glass text-white md:hidden ${props.rightSidebar === true ? 'hidden' : ''}`} onClick={() => props.setSidebar(prevState => !prevState)}>User</button>
                    <div className={`${props.rightSidebar === true ? 'hidden': ''}`}>

                        <Search />
                    </div>
                    <button className='join-item btn glass text-white md:hidden' onClick={() => props.setRightSidebar(prevState => !prevState)}>Info</button>
                </div>
                <div className={`join w-full p-2 ${props.rightSidebar === true ? 'hidden': ''}`}>
                    <button className={`joint-item w-1/2 btn ${sort.sort === 'newest' ? 'btn-neutral' : ''}`} onClick={() => handleSort(1)}>Newest</button>
                    <button className={`joint-item w-1/2 btn ${sort.sort === 'favorite' ? 'btn-neutral' : ''}`} onClick={() => handleSort(2)}>Top</button>
                </div>
            </div>
                <div className=' border border-black w-full'></div>
                {props.post && 
                    <div className='flex justify-center items-center'>
                        <PostForm delete={() => props.setPost(false)} refresh={reloadPage} />
                    </div>
                }   {!props.rightSidebar && 
                
                    <InfiniteScroll
                        dataLength={displayPosts && displayPosts.length} //This is important field to render the next data
                        style={{ overflow: 'hidden'}}
                        next={fetchData}
                        hasMore={hasMore}
                        loader={<span className="loading loading-bars loading-lg text-primary"></span>}
                        endMessage={
                            <p className='text-white text-4xl'>
                            <b>You have seen it all</b>
                            </p>
                        }
                        >
                        {displayPosts && displayPosts  }
                    </InfiniteScroll>
                }
                
        </div>
    )
}