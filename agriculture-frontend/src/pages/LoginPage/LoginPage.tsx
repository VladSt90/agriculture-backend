// src/components/LoginPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/apiService";
import "./LoginPage.css"; // Optional: Import a CSS file for styling.

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior.
    setError(null); // Reset error state before new login attempt.

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      await ApiService.login(username, password);
      console.log("Login successful");
      // Redirect the user to a different page after successful login.
      navigate("/imagesets-list"); // Replace with your route.
    } catch (error) {
      setError("Invalid username or password");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
