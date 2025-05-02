import React from 'react';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect user to login after logout
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <header className="header">
        <div className="header-content">
          <div className="logo-section">
          <a href="/" className=""> 
            {/* <Sparkles className="icon" /> */}
            <h1 className="logo-title">CapKraft </h1>
            </a>
          </div>

          <div className="auth-buttons">
            {user ? (
              <div className="user-info">
                <span className="user-name">Hi, {user.displayName || user.email}</span>
                <button onClick={handleLogout} className="btn-outline">
                  
                  Log out
                </button>
              </div>
            ) : (
              <div className="login-buttons">
                {/* <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/signup" className="btn-primary">Sign up</Link> */}
              </div>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;
