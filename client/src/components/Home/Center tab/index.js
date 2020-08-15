import React from 'react';
import MessageArea from '../Home Components/Message area';

const CenterTab = ({ showRightTab }) => {
  return (
    <div className="center-tab">
      <MessageArea showRightTab={showRightTab} />
    </div>
  );
};

export default CenterTab;
