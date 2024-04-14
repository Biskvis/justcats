import Link from 'next/link';

export default function NotificationsSidebar(props) {
    if (props.type === 'friendRequest') {

        return (
            <div className='p-2 bg-custom-dark1'>
                    <Link href={`/users/${props.friendName}`}>
                        <p className='text-amber-500 text-center'>{props.friendName}</p>
                    </Link>
                    <p className='text-white'>Sent a friend request.</p>
                    <div className='flex items-center p-2'>
                        <button className='btn btn-xs' onClick={() => props.handleRequest(1, props.friendUid, props.friendName, props.index)}>Accept</button>
                        <button className="ml-auto btn btn-xs btn-circle" onClick={() => props.handleRequest(2, props.friendUid, props.friendName, props.index)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
        )
    } else if (props.type === 'notification') {
        return (
            <div className='p-2 bg-custom-dark1 hover:bg-custom-dark flex gap-2'>
                <p className='text-white'>{props.message}</p>
                <button className="btn btn-xs btn-square self-end" onClick={() => props.deleteNotification(props.message, props.index)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )
    } else if (props.type === 'comment') {
        return (
            <div className='p-2 bg-custom-dark1 hover:bg-custom-dark flex gap-2'>
                <p className='text-white'>New comment on your <Link href={`/posts/${props.post}`} className='link link-primary'>Post</Link></p>
                <button className="btn btn-xs btn-square self-end" onClick={() => props.deleteCommentNotification(props.index, props.post)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        )
    }

}