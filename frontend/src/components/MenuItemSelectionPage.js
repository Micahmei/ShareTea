import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const MenuItemSelectionPage = () => {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/menu");
        setItems(
          res.data.filter((item) =>
            item.itemname.toLowerCase().includes(category.toLowerCase())
          )
        );
      } catch (err) {
        console.error("Error fetching menu items:", err);
      }
    };
    fetchItems();
  }, [category]);

  const handleCustomize = (item) => {
    const sugar = prompt("Select Sugar Level (e.g. No Sugar, 30%, 50%, 70%, 100%)", "50%");
    if (!sugar) return;
    const ice = prompt("Select Ice Level (e.g. No Ice, Less Ice, Normal Ice, Hot)", "Normal Ice");
    if (!ice) return;
    const topping = prompt("Select Topping (e.g. Boba, Lychee Jelly, Pearls, None)", "Boba");
    if (!topping) return;

    const orderItem = {
      ...item,
      customization: `Sugar: ${sugar} | Ice: ${ice} | Topping: ${topping}`,
    };

    const newCart = [...cart, orderItem];
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`${item.itemname} added to cart!`);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{category} Menu</h2>
      {items.length === 0 ? (
        <p>No items available.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.itemid} style={{ marginBottom: "15px" }}>
              <strong>{item.itemname}</strong> — ${Number(item.itemprice).toFixed(2)}
<br />

              <small>Ingredients: {item.ingredients.join(", ")}</small><br />
              <button onClick={() => handleCustomize(item)}>Customize & Add</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={goBack} style={{ marginTop: "20px" }}>Back</button>
    </div>
  );
};

export default MenuItemSelectionPage;
