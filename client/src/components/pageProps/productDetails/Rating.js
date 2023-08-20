import React, { useState, useEffect } from 'react';

const Star = ({ marked, onClick, onMouseEnter, onMouseLeave }) => (
  <span
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    style={{
      color: marked ? 'gold' : 'gray',
      cursor: 'pointer',
      transition: 'color 0.25s ease-in-out',
    }}
  >
    &#9733;
  </span>
);

const Rating = () => {
  const [ratings, setRatings] = useState([4, 3, 5]); // Example array of ratings
  const [rating, setRating] = useState(calculateAverageRating());
  const [hoverIndex, setHoverIndex] = useState(-1);

  useEffect(() => {
    setRating(calculateAverageRating());
  }, [ratings]);

  const calculateAverageRating = () => {
    const sum = ratings.reduce((total, current) => total + current, 0);
    return Math.round(sum / ratings.length);
  };

  const handleStarClick = (index) => {
    // Simulate adding a new rating
    const newRatings = [...ratings, index + 1];
    setRatings(newRatings);
  };

  const handleStarHover = (index) => {
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(-1);
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          marked={index <= (hoverIndex !== -1 ? hoverIndex : rating - 1)}
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleStarHover(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
      <p>Average rating: {rating}</p>
    </div>
  );
};

export default Rating;
