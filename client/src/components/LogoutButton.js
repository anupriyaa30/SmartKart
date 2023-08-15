import React from 'react';
import './styles/LogoutButton.css';

const LogoutButton = ({ onClick }) => {
  return (
    <button className="logout-button" onClick={onClick}>
      Logout
    </button>
  );
};

export default LogoutButton;