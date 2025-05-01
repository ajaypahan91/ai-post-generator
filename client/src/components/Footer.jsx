import React from 'react';
import { Sparkles } 
from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
    <div className="footer-content">
      <div className="footer-logo">
        <Sparkles className="footer-icon" />
        <span className="footer-title">CapKraft</span>
      </div>
      <div className="footer-text">
        &copy; {new Date().getFullYear()} CapKraft. 
      </div>
    </div>
  </footer>
  );
};

export default Footer;
