import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DrinkMenu = () => {
  const [drinkName, setDrinkName] = useState("");
  const [price, setPrice] = useState("");
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();

  const viewMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/menu");
      setMenuList(res.data);
    } catch (err) {
      alert("❌ Failed to fetch menu.");
    }
  };

  const addDrink = async () => {
    if (!drinkName || !price) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5050/api/menu/add", {
        itemname: drinkName,
        itemtype: "Seasonal",
        itemprice: parseFloat(price),
      });
      alert("✅ Drink added successfully!");
      setDrinkName("");
      setPrice("");
      viewMenu();
    } catch (err) {
      alert("❌ Failed to add drink.");
    }
  };

  const deleteDrink = async () => {
    if (!drinkName) {
      alert("Please enter the drink name to delete.");
      return;
    }
    try {
      await axios.post("http://localhost:5050/api/menu/delete", {
        itemname: drinkName,
      });
      alert("🗑️ Drink deleted successfully!");
      viewMenu();
    } catch (err) {
      alert("❌ Failed to delete drink.");
    }
  };

  useEffect(() => {
    viewMenu();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        🔙 Back
      </button>

      <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
        🥤 Seasonal Drink Menu Management
      </h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Drink Name"
          value={drinkName}
          onChange={(e) => setDrinkName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="flex space-x-2">
          <button
            onClick={addDrink}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            ➕ Add Drink
          </button>
          <button
            onClick={deleteDrink}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            🗑️ Delete
          </button>
          <button
            onClick={viewMenu}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-3">📋 Current Seasonal Menu</h3>
      {menuList.length === 0 ? (
        <p>No seasonal items available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Drink Name</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Price ($)</th>
                <th className="border px-4 py-2">Available</th>
              </tr>
            </thead>
            <tbody>
              {menuList
                .filter((item) => item.itemtype === "Seasonal")
                .map((item) => (
                  <tr key={item.itemid} className="text-center">
                    <td className="border px-4 py-2">{item.itemid}</td>
                    <td className="border px-4 py-2">{item.itemname}</td>
                    <td className="border px-4 py-2">{item.itemtype}</td>
                    <td className="border px-4 py-2">
                      {parseFloat(item.itemprice).toFixed(2)}
                    </td>
                    <td className="border px-4 py-2">
                      {item.available ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DrinkMenu;
