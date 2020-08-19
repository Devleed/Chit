import React from 'react';

const RightArrow = ({ goToNextSlide }) => {
  return (
    <div
      className="carousel-arrow carousel-right-arrow"
      onClick={goToNextSlide}>
      <img
        className="carousel-icon"
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828359/chat%20app/carousel-right-arrow_cgz4sr.svg"
      />
    </div>
  );
};

export default RightArrow;
