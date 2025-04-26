import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useAuth } from '../context/AuthContext'; // Import AuthContext to access the logout function

const Header = () => {
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = async () => {
    try {
      await logout(); // Log the user out
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <header className="header">
      <div className="container flex justify-between items-center">
        <h2 className="m-0">
          <i className="fas fa-magic mr-sm"></i>
          Social AI
        </h2>
        <nav>
          <button className="button button-outline button-sm" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
