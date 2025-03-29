import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl =
  process.env.REACT_APP_API_URL || "http://localhost:5050";

const DrinkMenu = () => {
  const [drinkName, setDrinkName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [menuList, setMenuList] = useState([]);
  const navigate = useNavigate();

  const viewMenu = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/menu`);
      setMenuList(res.data);
    } catch (err) {
      alert("❌ Failed to fetch menu.");
    }
  };

  const addDrink = async () => {
    if (!drinkName || !category || !price) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      await axios.post(`${apiUrl}/api/menu/add`, {
        itemname: drinkName,
        itemtype: category,
        itemprice: parseFloat(price),
      });
      alert("✅ Drink added successfully!");
      setDrinkName("");
      setCategory("");
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
      await axios.post(`${apiUrl}/api/menu/delete`, {
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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <button
        onClick={handleBack}
        className="mb-4 bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
      >
        🔙 Back
      </button>

      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        🥤 Drink Menu Management
      </h2>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Drink Name"
          value={drinkName}
          onChange={(e) => setDrinkName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addDrink}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          ➕ Add Drink
        </button>
        <button
          onClick={deleteDrink}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🗑️ Delete Drink
        </button>
        <button
          onClick={viewMenu}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          🔄 Refresh Menu
        </button>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">📋 Current Menu</h3>

      {menuList.length === 0 ? (
        <p className="text-gray-500">No items available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left font-semibold">ID</th>
                <th className="border px-4 py-2 text-left font-semibold">Drink Name</th>
                <th className="border px-4 py-2 text-left font-semibold">Category</th>
                <th className="border px-4 py-2 text-left font-semibold">Price ($)</th>
                <th className="border px-4 py-2 text-left font-semibold">Available</th>
              </tr>
            </thead>
            <tbody>
              {menuList.map((item) => (
                <tr key={item.itemid} className="hover:bg-gray-50">
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
