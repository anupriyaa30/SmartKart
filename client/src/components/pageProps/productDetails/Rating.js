import React, { useState } from 'react';

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
  const [rating, setRating] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const handleStarClick = (index) => {
    setRating(index + 1);
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
      <p>Selected rating: {rating}</p>
    </div>
  );
};

export default Rating;
