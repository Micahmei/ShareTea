import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CashPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderTotal = location.state?.total || 0;

  const [input, setInput] = useState("");
  const [change, setChange] = useState(null);

  const handleKey = (val) => {
    if (val === "C") return setInput("");
    if (val === "⌫") return setInput((prev) => prev.slice(0, -1));
    setInput((prev) => prev + val);
  };

  const handleSubmit = () => {
    const received = parseFloat(input);
    if (isNaN(received)) {
      alert("Invalid amount.");
      return;
    }
    if (received < orderTotal) {
      alert("Insufficient amount.");
      return;
    }
    setChange(received - orderTotal);
    setTimeout(() => {
      navigate("/thankyou", { state: { total: orderTotal } });
    }, 1500);
  };

  const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">💵 Cash Payment</h2>
        <p className="text-lg text-gray-700 mb-4">
          Total Due: <span className="font-semibold">${orderTotal.toFixed(2)}</span>
        </p>
        <input
          value={input}
          readOnly
          className="w-full text-2xl text-center py-2 border border-gray-300 rounded-lg mb-4"
        />
        <div className="grid grid-cols-3 gap-3 mb-6">
          {keypad.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-xl font-semibold"
            >
              {key}
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          ✅ Submit Payment
        </button>
        {change !== null && (
          <p className="mt-4 text-green-700 text-lg font-medium">
            Change: ${change.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
};

export default CashPaymentPage;
