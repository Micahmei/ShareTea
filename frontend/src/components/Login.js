// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
const apiUrl =
  process.env.REACT_APP_API_URL || "http://localhost:5050";
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/login`, {
        username,
        password,
      });
      if (res.data.success) {
        onLogin(res.data.user);
      }
    } catch (err) {
      setError("Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${apiUrl}/api/google-login`, {
        token: credentialResponse.credential,
      });
      if (res.data.success) {
        onLogin(res.data.user);
      }
    } catch (err) {
      setError("Google Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Employee Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Employee Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <hr className="my-6" />

        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => setError("Google Sign In Failed")}
        />

        <button
          onClick={() => navigate("/guest")}
          className="mt-4 w-full bg-gray-500 text-white font-semibold py-2 rounded hover:bg-gray-600"
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default Login;
