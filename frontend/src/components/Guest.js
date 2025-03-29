import React from "react";
import Menu from "./Menu";
import { useNavigate } from "react-router-dom";

const Guest = () => {
  const navigate = useNavigate();

  const guestUser = {
    role: "USER",
    name: "Guest"
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">👋 Welcome, Guest!</h2>

        <div className="mb-6 space-x-4">
          <button
            onClick={handleBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            🔙 Back
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
          >
            🚪 Back to Login
          </button>
        </div>

        {/* 渲染 Menu 组件 */}
        <Menu user={guestUser} />
      </div>
    </div>
  );
};

export default Guest;
