const Toast = ({ message, type }) => {
  if (!message) return null;
  return (
    <div className={`toast ${type}`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {message}
    </div>
  );
};

export default Toast;
