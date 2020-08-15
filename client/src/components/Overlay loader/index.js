import React from 'react';

const OverlayLoader = () => {
  return (
    // <div className="loader">
    //   <span></span>
    //   <span></span>
    //   <span></span>
    // </div>
    <div className="overlay">
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        {/* <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div> */}
      </div>
    </div>
  );
};

export default OverlayLoader;
