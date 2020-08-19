import React from 'react';

const Slide = ({ data, activeIndex }) => {
  return data.map((item, i) => (
    <img
      src={item.url}
      style={{
        width: `${item.width / 10}rem`,
        height: `${item.height / 10}rem`
      }}
      className={`carousel-image ${i === activeIndex ? 'active' : 'inactive'}`}
      key={i}
      alt={item.public_id}></img>
  ));
};

export default Slide;
