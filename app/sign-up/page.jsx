'use client'
import { useState } from 'react';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, doc, setDoc, getDocs, where, query } from "firebase/firestore"; 
import { db } from '../firebase/config'



const SignUp = () => {
  
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleSignUp = async () => {
    try {
        if (await isUsernameUnique(name)) {
          //proceed
          const res = await createUserWithEmailAndPassword(email, password)
          const docRef = await setDoc(doc(db, "users", res.user.uid), {
            name: name,
            email: email,
            name_lowerCase: name.toLowerCase(),
            avatarUrl: 'https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7',
            uid: res.user.uid,
            friends: [],
            notifications: [],
            bio: ''
            
        });
          setEmail('');
          setPassword('')
          router.push('/sign-in')
        } else {
          alert("Username is already taken. Try another")
        }
        

    } catch(e){
        console.error(e)
    }
  };

  async function isUsernameUnique(username) {
    const usersColRef = query(collection(db, 'users'), where('name', '==', username));
    try {
        const nameDocs = await getDocs(usersColRef);
        return nameDocs.empty; // Returns true if the username is unique, false if it already exists
    } catch (e) {
        console.log(e);
        return false; // Return false in case of error
    }
  }

  


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom-dark">
      <h1 className='text-center p-2 bg-gradient-to-r from-amber-600 via-amber-500 to-white inline-block text-transparent bg-clip-text text-4xl  font-bold'>JustCats</h1>
      <div className="bg-custom-dark1 p-10 rounded-lg shadow-xl w-96 max-w-screen-sm">
        <h1 className=" text-2xl mb-5 text-white">Sign Up</h1>
        <input 
          type="text" 
          placeholder="Username" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 mb-4  rounded outline-none  placeholder-gray-500"
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4  rounded outline-none  placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required
          className="w-full p-3 mb-4  rounded outline-none  placeholder-gray-500"
        />
        <button 
          onClick={handleSignUp}
          className="w-full p-3 text-xl bg-yellow-400 rounded  hover:bg-yellow-600 rounded-lg "
        >
          Sign Up
        </button>
        <Link
          href='/sign-in'
          className='mt-4 text-lg font-semibold text-blue-700 grid place-content-center hover:text-yellow-500'
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;