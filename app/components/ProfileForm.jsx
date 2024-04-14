'use client';

import { useState, useEffect, useContext } from 'react';
import { storage, db, auth } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import Image from 'next/image';
import { MyContext } from '../MyContext';
import { toast } from 'react-toastify'


export default function ProfileForm() {
    
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState('')
    const userData = useContext(MyContext);

    const handleUpload = async (event) => {
        event.preventDefault();
        try {
            const uniqueFilename = `${userData.uid}_avatar`;
            const imageRef = ref(storage, uniqueFilename);
            
            // Upload image to Firebase Storage
            const snapshot = await uploadBytes(imageRef, image);
            const url = await getDownloadURL(snapshot.ref);
            setUrl(url);
    
            // Update user's avatar URL in Firestore
            const docRef = doc(db, "users", userData.uid);
            await updateDoc(docRef, {
                avatarUrl: url
            });
            toast('Image uploaded')
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();

        const docRef = doc(db, "users", userData.uid);

        await updateDoc(docRef,  {
            bio: event.target.bio.value
        });
        toast('About you changed.')
    }
    

    return (
        <div className="bg-custom-dark">
            <div className="flex justify-center items-center">
                {userData && <div className='flex flex-col justify-center items-center border border-black'>
                        <h2 className='text-2xl text-white p-4'>{userData.name} Profile</h2>
                        <div className='flex justify-center items-center flex-col border-4 border-black'>
                            <h2 className='text-white text-xl p-2 '>Edit profile picture</h2>
                            <div className='avatar mt-4'>

                            <div className='w-22  rounded-xl'>
                                <Image
                                    src={url ? url: userData.avatarUrl}
                                    width={100}
                                    height={30}
                                    className='object-cover rounded-full'
                                    alt='avatar picture'
                                />
                            </div>
                            </div>
                            <form onSubmit={(e) => handleUpload(e)} className='py-4 p-2 flex flex-wrap md:block'>

                                <input type="file" required className="file-input file-input-primary w-60 md:w-80 " onChange={(e) => setImage(e.target.files[0])} />
                                <button  type='submit' className='btn btn-info '>Upload</button>
                            </form>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col justify-center items-center border-4 border-black w-full'>
                            <label className="form-control p-4">
                            <div className="label">
                                <span className="label-text text-white text-xl">About you</span>
                            </div>
                            <textarea name='bio' className="textarea textarea-bordered textarea-md w-full max-w-xs" maxLength={250} placeholder="Bio" defaultValue={userData.bio}></textarea>
                            </label>
                            <button type='submit' className='btn'>Change</button>
                        </form>
                        
                    </div>
                }
                
            </div>
        </div>
    );
}