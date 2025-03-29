import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Menu = ({ user }) => {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customizations, setCustomizations] = useState({});
  const navigate = useNavigate();

  const categories = [
    "All",
    "Fruit Tea",
    "Milk Tea",
    "Brewed Tea",
    "Ice Blended",
    "Fresh Milk",
    "Signature",
    "Seasonal",
    "Additional Toppings",
  ];

  const sugarOptions = ["No Sugar", "30%", "50%", "70%", "100%"];
  const iceOptions = ["No Ice", "Less Ice", "Normal Ice", "Hot"];
  const toppingOptions = [
    "None", "Boba", "Lychee Jelly", "Pearls", "Grass Jelly", "Pudding", "Aloe Vera", "Red Beans"
  ];

  useEffect(() => {
    fetchMenu("All");
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const fetchMenu = async (type) => {
    try {
      const res = type === "All"
        ? await axios.get("http://localhost:5050/api/menu")
        : await axios.get(`http://localhost:5050/api/menu/${encodeURIComponent(type)}`);
      setMenu(res.data);
      setSelectedCategory(type);
    } catch (err) {
      console.error("Failed to load menu:", err);
    }
  };

  const handleCustomizationChange = (itemid, field, value) => {
    setCustomizations((prev) => ({
      ...prev,
      [itemid]: {
        ...prev[itemid],
        [field]: value,
      },
    }));
  };

  const addToCart = (item) => {
    const { sugar = "100%", ice = "Normal Ice", topping = "None" } = customizations[item.itemid] || {};

    const newItem = {
      itemid: item.itemid,
      itemname: item.itemname,
      price: item.itemprice,
      customization: `Sugar: ${sugar} | Ice: ${ice} | Topping: ${topping}`,
    };

    const updatedCart = [...cart, newItem];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${item.itemname} added to cart!`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* 顶部栏 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-purple-700">🥤 Bubble Tea Menu</h2>
        {/* ✅ 仅当 user 不是 Guest 才显示 History 按钮 */}
        {user?.name !== "Guest" && (
          <button
            onClick={() => navigate("/order-history")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🧾 History
          </button>
        )}
      </div>

      {/* 分类按钮 */}
      <div className="overflow-x-auto mb-6 whitespace-nowrap space-x-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => fetchMenu(cat)}
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              selectedCategory === cat
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 菜单列表 */}
      {menu.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <div
              key={item.itemid}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-100 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">{item.itemname}</h3>
              <p className="text-gray-600 mb-2">${Number(item.itemprice).toFixed(2)}</p>

              <div className="space-y-2 text-sm">
                <label className="block">
                  <span className="text-gray-700">Sugar</span>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={customizations[item.itemid]?.sugar || "100%"}
                    onChange={(e) => handleCustomizationChange(item.itemid, "sugar", e.target.value)}
                  >
                    {sugarOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">Ice</span>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={customizations[item.itemid]?.ice || "Normal Ice"}
                    onChange={(e) => handleCustomizationChange(item.itemid, "ice", e.target.value)}
                  >
                    {iceOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-gray-700">Topping</span>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={customizations[item.itemid]?.topping || "None"}
                    onChange={(e) => handleCustomizationChange(item.itemid, "topping", e.target.value)}
                  >
                    {toppingOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
              >
                ➕ Add to Order
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ 浮动 View Cart */}
      <button
        onClick={() => navigate("/cart")}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 z-50"
      >
        🛒 View Cart
      </button>
    </div>
  );
};

export default Menu;
