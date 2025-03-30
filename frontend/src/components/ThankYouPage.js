// src/components/ThankYouPage.js
import React, { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderTotal = location.state?.total || 0;
  const user = useMemo(() => location.state?.user || {}, [location.state]);
  const orderNumber = Math.floor(1000 + Math.random() * 9000);

  useEffect(() => {
    if (user.name === "Guest") {
      const timer = setTimeout(() => {
        navigate("/"); // ⬅️ 5秒后跳转到登录页
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-yellow-50 to-pink-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-pink-600 mb-4">🎉 Thank You!</h2>
        <p className="text-lg text-gray-700 mb-2">
          Your order number is: <span className="font-semibold text-black">#{orderNumber}</span>
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Order Total: <span className="font-semibold">${orderTotal.toFixed(2)}</span>
        </p>
        <button
          onClick={() => navigate("/menu", { state: { user } })}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg text-lg font-semibold"
        >
          🍹 Back to Menu
        </button>

        {user.name === "Guest" && (
          <p className="mt-4 text-sm text-gray-500 italic">
            Redirecting to login page in 5 seconds...
          </p>
        )}
      </div>
    </div>
  );
};

export default ThankYouPage;
