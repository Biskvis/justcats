import Image from 'next/image';
import Link from 'next/link';
import Card from './Card'

export default function PostPage({ postData }) {
    return (
        <div className='container grid place-content-center md:m-4 md:pb-4'>
            <Card  title={postData.title} desc={postData.description} imgUrl={postData.imageUrl} uid={postData.uid} name={postData.name} postId={postData.postId} createdAt={postData.createdAt} comments={postData.comments} />
        </div>
    )
}