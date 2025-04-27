import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/auth.css";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/Aipost");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePressHold = (setter, value) => {
    setter(value);
  };

  return (
    <div className="auth-page">
    <div className="auth-container">
    <div className="home">
        <i className="fa-solid fa-chevron-left"></i>
        <a href="/" className=""> 
            Back to home
          </a>
        </div>
      <div className="auth-form-container">
        <h2 className="auth-title">Sign in to your account</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
          <label className="login-label">Email address</label>
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ position: "relative" }}>
          <label className="login-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-icon"
              onMouseDown={() => handlePressHold(setShowPassword, true)}
              onMouseUp={() => handlePressHold(setShowPassword, false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => handlePressHold(setShowPassword, true)}
              onTouchEnd={() => handlePressHold(setShowPassword, false)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          <p className="forgot-password-text">
            <a href="/reset-password" className="no-underline">Forgot password?</a>
          </p>


          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="auth-switch-text">
          Don't have an account? <a href="/signup" >Sign Up</a>
        </p>
      </div>
    </div>
    </div>
  );
}
