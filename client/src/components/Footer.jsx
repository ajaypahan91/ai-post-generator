import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo-section">
          <img src="../assets/logo1.png" alt="CapKraft Logo" className="logo-image" />
        </div>
        <div className="footer-text">
          &copy; {new Date().getFullYear()} CapKraft.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
