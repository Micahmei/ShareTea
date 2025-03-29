// src/components/Cashier.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Menu from "./Menu"; // 引入菜单组件

const CashierDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">💼 Cashier Dashboard</h1>

      {/* 👉 天气查询按钮 */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/weather")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ☀️ 查看天气
        </button>
      </div>

      <Menu />
    </div>
  );
};

export default CashierDashboard;
