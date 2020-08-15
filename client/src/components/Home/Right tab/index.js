import React from 'react';

const RightTab = ({ tab }) => {
  if (tab === null) return null;
  return <div className="right-tab">{tab}</div>;
};

export default RightTab;
