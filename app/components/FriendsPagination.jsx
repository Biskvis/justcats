'use client'

import React, { useState } from 'react';
import FriendsSidebar from './FriendsSidebar';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 5; // Number of items to display per page

function DisplayFriendsPagination({ user }) {
    const [currentPage, setCurrentPage] = useState(0);

    // Calculate total number of pages based on the number of friends
    const totalPages = Math.ceil(user.friends.length / ITEMS_PER_PAGE);

    // Slice the friends array to display only the items for the current page
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentFriends = user.friends.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (selectedPage) => {
        setCurrentPage(selectedPage);
    };

    return (
        <div>
            {currentFriends.map((friend, index) => (
                <FriendsSidebar key={friend.friendName} friendName={friend.friendName} friendUid={friend.friendUid} />
            ))}
            {currentFriends.length > 0 ? 
                <div className="pagination justify-center">
                    <ReactPaginate
                        pageCount={totalPages}
                        onPageChange={({ selected }) => handlePageChange(selected)}
                        previousLabel="Prev"
                        nextLabel="Next"
                        breakLabel="..."
                        marginPagesDisplayed={0}
                        pageRangeDisplayed={0}
                        containerClassName="join p-2"
                        previousClassName='join-item btn btn-sm btn-neutral'
                        nextClassName='join-item btn btn-sm btn-neutral'
                        pageClassNam='join-item btn btn-sm'
                        activeClassName="join-item btn btn-sm btn-primary "
                    />
                </div>
                : <p className='text-white p-2 word-break'>Add friends to see them here.</p>
            }
        </div>
    );
}

export default DisplayFriendsPagination;
