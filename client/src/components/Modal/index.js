import React from 'react';
import reactDOM from 'react-dom';

/** MAIN COMPONENT
 * - responsible for displaying content as modal
 */
const Modal = props => {
  if (!props.show) {
    return null;
  }

  return reactDOM.createPortal(
    <div
      className="modal"
      onClick={() => {
        props.setShowModal(false);
      }}>
      {props.children}
    </div>,
    document.getElementById('modal')
  );
};

export default Modal;
