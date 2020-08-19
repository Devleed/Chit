import React, { useState } from 'react';
import LeftArrow from './LeftArrow';
import RightArrow from './RightArrow';
import Slide from './Slide';

const Carousel = ({ data, defaultActiveIndex, setShowModal }) => {
  let [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  const goToPrevSlide = () => {
    setActiveIndex(--activeIndex);
  };
  const goToNextSlide = () => {
    setActiveIndex(++activeIndex);
  };

  return (
    <div className="carousel">
      <Slide data={data} activeIndex={activeIndex} />
      {activeIndex === 0 || data.length === 1 ? null : (
        <LeftArrow goToPrevSlide={goToPrevSlide} />
      )}
      {activeIndex === data.length - 1 || data.length === 1 ? null : (
        <RightArrow goToNextSlide={goToNextSlide} />
      )}
      <div className="image-opts">
        <span className="cancel-image" onClick={() => setShowModal(false)}>
          &times;
        </span>
      </div>
    </div>
  );
};

export default Carousel;
