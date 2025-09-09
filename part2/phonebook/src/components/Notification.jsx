const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  const notificationStyle = {
    color: 'green',
    border: 'green',
    borderWidth: '1px',
    borderStyle: 'solid',
    backgroundColor: '#bbb',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '10px',
    marginBottom: '10px',
  };

  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
