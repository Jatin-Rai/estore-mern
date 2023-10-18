import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, reviews }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    // Check if the current star should be filled or empty
    const isFilled = i <= rating;

    // Create a star icon element with the appropriate class
    const starIcon = (
      <FaStar key={i} className={`text-xs ${isFilled ? 'text-yellow-300' : 'text-gray-300'}`} />
    );

    stars.push(starIcon);
  }

  return <div className="flex items-center mt-2.5 mb-5">
    {stars}
    <div className='flex gap-2 items-center'>
      <p className='text-yellow-400 pl-2'>{rating}</p>
      <p className='italic text-xs'>{reviews} reviews</p>
    </div>
  </div>;
};

export default StarRating;
