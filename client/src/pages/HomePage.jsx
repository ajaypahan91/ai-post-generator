import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { 
  Image, MessageSquare, Share2, Sparkles, Instagram, Twitter, Facebook, Copy, ArrowRight
} 
from "lucide-react";
import "../styles/homepage.css";

export default function Home() {
  const { user, logout } = useAuth(); 
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            {/* <Sparkles className="icon" /> */}
            <h1 className="logo-title">PostCraft AI</h1>
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
                <Link to="/login" className="btn-ghost">Log in</Link>
                <Link to="/signup" className="btn-primary">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Generate Stunning Social Media Posts with AI</h1>
          <p className="hero-subtitle">Create captivating social media content with just a few clicks. Our AI helps you generate eye-catching posts and engaging captions for any platform.</p>

          {user ? (
            <Link to="/Aipost" className="btn-primary-large">
              Create New Post
             </Link>
          ) : (
            <Link to="/signup" className="btn-primary-large">
              Get Started Now
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">How It Works</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Image />
            </div>
            <h3 className="feature-title">1. Choose Platform</h3>
            <p className="feature-text">Choose your platform, select tone, image style and write keywords to get your post ready.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <MessageSquare />
            </div>
            <h3 className="feature-title">2. Generate Captions</h3>
            <p className="feature-text">Our AI analyzes your input and creates engaging, platform-specific captions.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Share2 />
            </div>
            <h3 className="feature-title">3. Share & Publish</h3>
            <p className="feature-text">Customize your post and share directly to your favorite social platforms.</p>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="platforms-section">
        <h2 className="section-title">Generate for Any Platform</h2>
        <p className="section-subtitle">Our AI is trained to create optimized content for all popular social media platforms.</p>

        <div className="platforms-grid">
          <div className="platform-card">
            <Instagram className="platform-icon text-orange-500" />
            <span>Instagram</span>
          </div>
          <div className="platform-card">
            <Facebook className="platform-icon" color=" #1877F2"/>
            <span>Facebook</span>
          </div>
          <div className="platform-card">
            <Twitter className="platform-icon" />
            <span>Twitter</span>
          </div>
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to Transform Your Social Media?</h2>
        <p className="cta-subtitle">Join thousands of creators who save time and boost engagement with our AI-powered caption generator.</p>

        {user ? (
          <Link to="/Aipost" className="btn-white">
            Get Started
          </Link>
        ) : (
          <Link to="/signup" className="btn-white">
            Create Free Account
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Sparkles className="footer-icon" />
            <span className="footer-title">PostCraft AI</span>
          </div>
          <div className="footer-text">
            &copy; {new Date().getFullYear()} PostCraft AI. 
          </div>
        </div>
      </footer>
    </div>
  );
}
