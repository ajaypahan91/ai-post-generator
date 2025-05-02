import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/auth.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ Password reset email sent ! Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2 className="auth-title">Reset Password</h2>
        <form onSubmit={handleReset}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
        </form>
        <p className="auth-switch-text">
          Remembered your password? <a href="/login">Back to Login</a>
        </p>
      </div>
    </div>
  );
}
