import React from 'react';

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationErrorStyle = {
    color: 'red',
    border: 'red',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: '#bbb',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '10px',
    marginBottom: '10px',
  };

  return <div style={notificationErrorStyle}>{message}</div>;
};

export default ErrorNotification;
