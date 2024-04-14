'use client'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function FriendsSidebar(props) {

    return (
        <div className='flex flex-col justify-center items-center p-2 hover:bg-custom-dark duration-500 tooltip' data-tip={props.friendName}>
            <Link href={`/users/${props.friendName}`}>
                <div className="avatar">
                    <div className="w-20 rounded-full border">
                    <Image 
                            src={`https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/${props.friendUid}_avatar?alt=media&token=def9f697-f938-4c47-b085-e66ba888d929`}
                            width={300}
                            height={300}
                            alt='profile pic'
                            unoptimized = {true}
                            onError={(e) => {e.target.src="https://firebasestorage.googleapis.com/v0/b/justcats-24a26.appspot.com/o/cat-profile.png?alt=media&token=9c7e9afe-2231-4b72-899e-ec7ce58352f7"
                        }}
                        />
                    </div>
                </div>
                <p className='text-amber-500 text-center'>{props.friendName}</p>
            </Link>
        </div>
    );
}
