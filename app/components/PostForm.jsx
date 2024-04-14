'use client'
import { useState, useContext } from 'react'
import Image from 'next/image'
import { storage, db, auth } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL  } from "firebase/storage";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { MyContext } from '../MyContext';

export default function PostForm(props) {

    const user = useContext(MyContext)
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState('');

    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (image === null) return alert('No image selected');
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}_${image.name}`;
        const imageRef = ref(storage, uniqueFilename);
        
        
        uploadBytes(imageRef, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setUrl(url);
            });
        }).catch((error) => {
            console.error('Error uploading file:', error);
        });
    };

    
    async function handleSubmit(event) {
        event.preventDefault(); 
        if (!url) return alert('Picture not uploaded: Click on "Upload" first');   
        try {
            const dateNow = new Date()
            const docRef = await addDoc(collection(db, "posts"), {
                name: user.name, // Use the retrieved user's name
                createdAt: dateNow,
                uid: user.uid,
                title: event.target.title.value,
                title_lowerCase: event.target.title.value.toLowerCase(),
                imageUrl: url,
                description: event.target.description.value
            });
            const postId = docRef.id;

            // Update the document with the generated ID
            await updateDoc(doc(db, "posts", postId), {
                postId: postId // Add the postId field to the document data
            });
            props.refresh()
            props.delete();
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    
    return (
        <form onSubmit={(e) => handleSubmit(e)} className='bg-slate-200  rounded-lg mt-12 flex flex-col shadow-2xl max-w-[32rem]'>
        <div className='flex flex-row p-2'>

            <p className='text-2xl p-2 font-bold'>
                <input name='title' required type='text' placeholder='Title' className='bg-slate-300 text-black border placeholder-black'/>
                
                </p>
            <div className='avatar ml-auto static'>

                <div className='w-16 rounded-xl'>
                    <Image
                        src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${props.uid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`}
                        width={100}
                        height={30}
                        className='object-cover rounded-full'
                        alt='avatar'
                        unoptimized = {true}
                        onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"}}
                    />
                </div>
            </div>
        </div>
        {url ?  <Image
                src={url}
                width={600}
                height={200}
                className='rounded-lg object-cover object-center max-h-96'
                alt='uploaded-photo'
            /> :
            <div>

        <input 
            type="file" 
            required
            className="file-input file-input-bordered m-2 file-input w-full max-w-xs"
            onChange={handleChange}
         />
         <button className='btn btn-info' type='button' onClick={handleUpload}>Upload</button>
         </div>
        }        
        <textarea name='description' className="textarea  m-2 text-black bg-slate-300 placeholder-black" placeholder="Description"></textarea>
        <div className='p-2'>

            <button className='btn w-20 btn-warning' type='submit'>Post</button>
            <button className='btn btn-error w-20 float-right'
                onClick={props.delete}
            >Delete</button>
        </div>
    </form>
    )
}