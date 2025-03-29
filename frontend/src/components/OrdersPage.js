import React, { useEffect, useState } from "react";
import axios from "axios";
const apiUrl =
  process.env.REACT_APP_API_URL || "http://localhost:5050";
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/orders`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error loading orders:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">📦 Past Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order.orderid}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <div className="mb-2 text-lg font-semibold text-gray-800">
                Order #{order.orderid} — 💰 ${parseFloat(order.ordertotal).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">
                👤 Customer: <span className="font-medium">{order.customername}</span>
              </div>
              <div className="text-sm text-gray-600">
                🕒 Time: {new Date(order.ordertimestamp).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                💳 Payment: {order.paymentmethod}
              </div>

              <ul className="mt-4 text-sm text-gray-700 list-disc list-inside">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    🧾 Item ID: {item.menu_item_id} | Qty: {item.quantity} | ${parseFloat(item.price).toFixed(2)} — <span className="italic">{item.transactioncategory}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
