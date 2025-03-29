import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("📦 Current Cart from localStorage:", storedCart);
    setCart(storedCart);
  }, []);

  const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const submitOrder = async () => {
    const customerName = prompt("Enter your name:");
    const userId = prompt("Enter your user ID:");
    const paymentMethod = "Cash";

    if (!customerName || !userId || cart.length === 0) {
      alert("❌ Missing customer name, user ID, or cart is empty.");
      return;
    }

    const items = cart.map((item) => ({
      itemid: Number(item.itemid),
      price: Number(item.price),
      customization: item.customization || "",
    }));

    const payload = {
      customerName,
      userId: parseInt(userId),
      items,
      paymentMethod,
    };

    console.log("📤 Submitting payload to backend:", payload);

    try {
      const res = await axios.post("http://localhost:5050/api/orders", payload);
      console.log("✅ Server response:", res.data);
      if (res.data.success) {
        const total = items.reduce((sum, i) => sum + i.price, 0);
        setCart([]);
        localStorage.removeItem("cart");
        navigate("/payment", { state: { total } });
      } else {
        throw new Error(res.data.message || "Order failed");
      }
    } catch (err) {
      console.error("❌ Failed to submit order:", err);
      alert("❌ Failed to submit order. Check the console and server.");
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-green-700">🛒 Your Cart</h2>
        <button
          onClick={goBack}
          className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded"
        >
          🔙 Back
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="bg-white shadow p-4 rounded border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-gray-800">{item.itemname}</p>
                    <p className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 italic">{item.customization}</p>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    ❌ Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={submitOrder}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded"
          >
            ✅ Submit Order
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
