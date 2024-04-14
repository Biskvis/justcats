import { useEffect, useState, useContext } from 'react'
import { db, auth } from '../firebase/config'
import { query, collection, getDoc, doc, getDocs, where } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { MyContext } from '../MyContext'

export default function FavoritesForm() {

    const userData = useContext(MyContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {

        const fetchUser = async () => {
            try {

                const postList = userData.favorites;
                const q = query(collection(db, "posts"), where('postId', 'in', postList));
                const querySnapshot = await getDocs(q);
                console.log('trying')
                const postData = querySnapshot.docs.map((doc) => doc.data());
                setPosts(postData);
            } catch(error) {
                console.log('error')
            }
            
        };

        fetchUser();
        
    }, [userData]); 

    const displayPosts = posts.map(item =>
        <div key={item.postId} className=''>
            <Link href={`/posts/${item.postId}`}>
            
                <Image 
                    src={item.imageUrl}
                    width={300}
                    height={200}
                    alt={item.title}
                    className='object-cover hover:scale-110'
                />
            </Link>
        </div>
    )
        
    return (
        <div className="mt-4 ml-4 container mx-auto ">
            <div className='text-white text-3xl'>
                <h1 className='text-center'>Favorites</h1>
                <div className='w-full m-4 max-w-5xl mx-auto columns-3 space-y-5'>

                    {displayPosts}
                </div>
            </div>
        </div>
    )
}