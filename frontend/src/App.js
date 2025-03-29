import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";

// 页面组件导入
import Login from "./components/Login";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Cashier from "./components/Cashier";
import Manager from "./components/Manager";
import MenuItemSelectionPage from "./components/MenuItemSelectionPage";
import Guest from "./components/Guest";
import OrdersPage from "./components/OrdersPage";
import DrinkMenu from "./components/DrinkMenu";
import Inventory from "./components/Inventory";
import Trends from "./components/Trends";
import Employee from "./components/Employee";
import AddSeasonalItem from "./components/AddSeasonalItem";
import ProductUsage from "./components/ProductUsage";
import XReport from "./components/XReport";
import ZReport from "./components/ZReport";
import PaymentPage from "./components/PaymentPage";
import CashPaymentPage from "./components/CashPaymentPage";
import ThankYouPage from "./components/ThankYouPage";
import OrderHistory from "./components/OrderHistory";
import WeatherPage from "./components/WeatherPage";


// 从 .env 读取 Google Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const App = () => {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  const handleLogin = (userData) => {
    setUser(userData);
    const role = userData.role.toLowerCase();
    switch (role) {
      case "manager":
        navigate("/manager");
        break;
      case "cashier":
        navigate("/cashier");
        break;
      case "chef":
        navigate("/menu");
        break;
      default:
        navigate("/menu");
        break;
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        {/* 顶部导航栏 */}
        <header className="flex items-center justify-between p-4 bg-blue-100 shadow-md">
          {/* 语言切换按钮 */}
          <div className="flex items-center gap-2 w-1/4">
            <button
              onClick={() => changeLanguage("en")}
              className="px-2 py-1 bg-white rounded border border-blue-300 text-sm hover:bg-blue-200"
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("es")}
              className="px-2 py-1 bg-white rounded border border-blue-300 text-sm hover:bg-blue-200"
            >
              ES
            </button>
          </div>

          {/* 标题 */}
          <div className="w-1/2 text-center">
            <h2 className="text-2xl font-bold text-blue-700">{t("Share Tea")}</h2>
          </div>

          {/* 用户信息/退出 */}
          {user ? (
            <div className="flex items-center justify-end gap-3 w-1/4">
              <button
                onClick={handleBack}
                className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                ← Back
              </button>
              <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="w-1/4"></div>
          )}
        </header>

        {/* 路由 */}
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/menu" element={<Menu user={user} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cashier" element={<Cashier />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/menu-category/:category" element={<MenuItemSelectionPage />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/drink-menu" element={<DrinkMenu />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/employee" element={<Employee />} />
          <Route path="/add-seasonal" element={<AddSeasonalItem />} />
          <Route path="/product-usage" element={<ProductUsage />} />
          <Route path="/x-report" element={<XReport />} />
          <Route path="/z-report" element={<ZReport />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/cash" element={<CashPaymentPage />} />
          <Route path="/thankyou" element={<ThankYouPage />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/weather" element={<WeatherPage />} />

        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
