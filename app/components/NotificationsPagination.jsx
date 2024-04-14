'use client'

import React, { useState } from 'react';
import FriendsSidebar from './FriendsSidebar';
import ReactPaginate from 'react-paginate';

const ITEMS_PER_PAGE = 5; // Number of items to display per page

function NotificationsPagination({ user }) {
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
                <FriendsSidebar key={index} friendName={friend.friendName} friendUid={friend.friendUid} />
            ))}
            <div className="pagination">
                <ReactPaginate
                    pageCount={totalPages}
                    onPageChange={({ selected }) => handlePageChange(selected)}
                    previousLabel="Previous"
                    nextLabel="Next"
                    breakLabel="..."
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    containerClassName="pagination"
                    activeClassName="active"
                />
            </div>
        </div>
    );
}

export default NotificationsPagination;
