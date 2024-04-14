'use client'
import { useState } from 'react';
import {useSignInWithEmailAndPassword} from 'react-firebase-hooks/auth'
import {auth} from '@/app/firebase/config'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter()


  const handleSignIn = async () => {
    try {
        const res = await signInWithEmailAndPassword(email, password);
        console.log({res});
        sessionStorage.setItem('user', true)
        setEmail('');
        setPassword('');
        router.push('/')
    }catch(e){
        console.error(e)
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-custom-dark">
      <h1 className='text-center p-2 bg-gradient-to-r from-amber-600 via-amber-500 to-white inline-block text-transparent bg-clip-text text-4xl  font-bold'>JustCats</h1>
      <div className="bg-custom-dark1  p-10 rounded-lg shadow-xl w-96 max-w-screen-sm" >
        <h1 className="text-2xl mb-5 text-white">Sign In</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4  rounded outline-none  placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4  rounded outline-none  placeholder-gray-500"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-3 text-xl bg-yellow-400 rounded  hover:bg-yellow-600 rounded-lg"
        >
          Login
        </button>
        <Link
          href='/sign-up'
          className='mt-4 text-lg font-semibold text-blue-700 grid place-content-center hover:text-yellow-500'
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;