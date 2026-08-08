import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../authContext";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
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
          <h2>Sign in to jhaGit</h2>
        </div>

        {error && <div className="auth-error-banner" role="alert">{error}</div>}

        <form onSubmit={handleLogin}>
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
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <div className="auth-footer">
        New to jhaGit? <Link to="/signup">Create an account</Link>
      </div>
    </div>
  );
};

export default Login;