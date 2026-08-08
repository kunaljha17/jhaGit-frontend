import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "./auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/signup", {
        email: email,
        password: password,
        username: username,
      });

      // Backend no longer returns a token at signup — user must verify OTP first
      setLoading(false);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Username or Email may already exist.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-logo-container">
        <img
            src="https://res.cloudinary.com/dzffc9b1p/image/upload/v1786171616/copy_of_jhagit-logo-2_myvvyn.png"
            alt="jhaGit Logo"
            className="octicon-logo auth-logo-img"
          />
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <h2>Create your account</h2>
        </div>

        {error && <div className="auth-error-banner" role="alert">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="auth-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="auth-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>

      <div className="auth-footer">
        Already have an account? <Link to="/auth">Sign in</Link>
      </div>
    </div>
  );
};

export default Signup;