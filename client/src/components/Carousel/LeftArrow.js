import React from 'react';

const LeftArrow = ({ goToPrevSlide }) => {
  return (
    <div className="carousel-arrow carousel-left-arrow" onClick={goToPrevSlide}>
      <img
        className="carousel-icon"
        src="https://res.cloudinary.com/drhgwsxz0/image/upload/v1597828359/chat%20app/carousel-left-arrow_p9f9dw.svg"
      />
    </div>
  );
};

export default LeftArrow;
