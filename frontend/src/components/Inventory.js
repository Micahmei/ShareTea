import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl =
  process.env.REACT_APP_API_URL || "http://localhost:5050";
const Inventory = () => {
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [inventoryList, setInventoryList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    viewInventory();
  }, []);

  const viewInventory = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/inventory`);
      setInventoryList(res.data);
    } catch (err) {
      alert("❌ Failed to fetch inventory");
    }
  };

  const addInventory = async () => {
    if (!itemId || !quantity) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/inventory/add`, {
        menuitemid: itemId,
        quantity: quantity,
      });
      alert("✅ Inventory added successfully!");
      setItemId("");
      setQuantity("");
      viewInventory();
    } catch (err) {
      alert("❌ Failed to add inventory.");
    }
  };

  const updateInventory = async () => {
    if (!itemId || !quantity) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      await axios.post(`${apiUrl}/api/inventory/update`, {
        inventoryid: itemId,
        quantity: quantity,
      });
      alert("✅ Inventory updated successfully!");
      viewInventory();
    } catch (err) {
      alert("❌ Failed to update inventory.");
    }
  };

  const deleteInventory = async () => {
    if (!itemId) {
      alert("Please enter an Item ID to delete.");
      return;
    }

    try {
      await axios.delete(`${apiUrl}/api/inventory/delete`, {
        data: { inventoryid: itemId },
      });
      alert("✅ Inventory deleted successfully!");
      viewInventory();
    } catch (err) {
      alert("❌ Failed to delete inventory.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <h2 className="text-2xl font-bold text-green-700 mb-6">📦 Inventory Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Item ID"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addInventory}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ Add Inventory
        </button>
        <button
          onClick={updateInventory}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          🔄 Update Inventory
        </button>
        <button
          onClick={deleteInventory}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ❌ Delete Inventory
        </button>
        <button
          onClick={() => navigate("/manager")}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ⬅️ Back to Manager
        </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">📋 Current Inventory</h3>
      {inventoryList.length === 0 ? (
        <p className="text-gray-500">No inventory records available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">Inventory ID</th>
                <th className="border px-4 py-2 text-left font-semibold">Item ID</th>
                <th className="border px-4 py-2 text-left font-semibold">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventoryList.map((item) => (
                <tr key={item.inventoryid} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{item.inventoryid}</td>
                  <td className="border px-4 py-2">{item.menuitemid}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;
