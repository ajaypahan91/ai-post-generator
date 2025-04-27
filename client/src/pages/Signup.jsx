import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [username, setUsername] = useState(""); // New username state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name (username)
      await updateProfile(userCredential.user, {
        displayName: username,
      });

      navigate("/login");
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
          <h2 className="auth-title">Create your account</h2>
          <form onSubmit={handleSignup}>

            {/* Username Field */}
            <label className="login-label">Name</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="Your username"
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <label className="login-label">Email address</label>
            <div className="input-group">
              <input
                type="email"
                placeholder="you@gmail.com"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
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

            {/* Confirm Password Field */}
            <div className="input-group" style={{ position: "relative" }}>
              <label className="login-label">Confirm password</label>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                className="auth-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onMouseDown={() => handlePressHold(setShowConfirm, true)}
                onMouseUp={() => handlePressHold(setShowConfirm, false)}
                onMouseLeave={() => setShowConfirm(false)}
                onTouchStart={() => handlePressHold(setShowConfirm, true)}
                onTouchEnd={() => handlePressHold(setShowConfirm, false)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>
          <p className="auth-switch-text">
            Already have an account?{" "}
            <a href="/login" className="no-underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
