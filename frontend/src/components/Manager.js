import React from "react";
import { useNavigate } from "react-router-dom";

const Manager = () => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 px-6 flex flex-col items-center">
      <h2 className="text-4xl font-extrabold text-indigo-800 mb-10 drop-shadow">
        👩‍💼 Manager Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          { label: "Drink Menu", path: "/drink-menu" },
          { label: "Inventory", path: "/inventory" },
          { label: "Trends", path: "/trends" },
          { label: "Employee", path: "/employee" },
          { label: "Orders", path: "/menu" },
          { label: "Add Seasonal Menu Item", path: "/add-seasonal" },
          { label: "Product Usage", path: "/product-usage" },
          { label: "X-Report", path: "/x-report" },
          { label: "Z-Report", path: "/z-report" },
          { label: "Order History", path: "/order-history" },
        ].map(({ label, path }) => (
          <button
            key={label}
            onClick={() => goTo(path)}
            className="bg-white shadow-lg p-5 rounded-xl text-indigo-700 font-semibold text-lg hover:bg-indigo-50 hover:shadow-xl transition duration-200"
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => goTo("/")}
          className="bg-red-500 text-white p-5 rounded-xl font-semibold hover:bg-red-600 shadow-lg transition duration-200 col-span-full"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Manager;
