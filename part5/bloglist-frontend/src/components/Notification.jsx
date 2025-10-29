import React from 'react';

const Notification = ({ message, isError }) => {
  return <div className={`${isError ? 'error' : 'success'}`}>{message}</div>;
};

export default Notification;
