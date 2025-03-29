import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/transactions");
      // 按 id 倒序排列
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setTransactions(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
    }
  };

  const filteredTransactions = transactions.filter((txn) =>
    Object.values(txn).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📋 Order History</h2>

      <input
        type="text"
        placeholder="Search by payment method, category, ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded w-full max-w-md"
      />

      {filteredTransactions.length === 0 ? (
        <p>No transaction records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Sale ID</th>
                <th className="p-2 border">Menu Item ID</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price ($)</th>
                <th className="p-2 border">Payment Method</th>
                <th className="p-2 border">Transaction Category</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-100">
                  <td className="p-2 border">{txn.id}</td>
                  <td className="p-2 border">{txn.sale_id}</td>
                  <td className="p-2 border">{txn.menu_item_id}</td>
                  <td className="p-2 border">{txn.quantity}</td>
                  <td className="p-2 border">{parseFloat(txn.price).toFixed(2)}</td>
                  <td className="p-2 border">{txn.paymentmethod}</td>
                  <td className="p-2 border">{txn.transactioncategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
