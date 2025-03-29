import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderTotal = location.state?.total || 0;

  const handleCash = () => {
    navigate("/payment/cash", { state: { total: orderTotal } });
  };

  const handleCard = () => {
    alert("💳 Payment successful via Card!");
    navigate("/thankyou", { state: { total: orderTotal } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-green-800 mb-4">💰 Payment</h2>
        <p className="text-lg text-gray-700 mb-6">
          Total Amount: <span className="font-semibold">${orderTotal.toFixed(2)}</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleCash}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Pay with Cash
          </button>
          <button
            onClick={handleCard}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Pay with Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
