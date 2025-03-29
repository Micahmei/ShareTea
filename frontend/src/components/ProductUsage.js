import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ProductUsage = () => {
  const [salesData, setSalesData] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeRange !== "Custom Range") {
      loadTrendData();
    }
  }, [timeRange]);

  const loadTrendData = async () => {
    try {
      setLoading(true);
      const params = { startDate, endDate, timeRange };
      const response = await axios.get("http://localhost:5050/api/productusage", { params });
      const trendData = response.data;
      setSalesData(trendData.map((item) => item.totalUsed));
      setDateLabels(trendData.map((item) => item.itemName));
    } catch (err) {
      console.error("Error fetching product usage data:", err);
      alert("❌ Failed to fetch trend data.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: dateLabels,
    datasets: [
      {
        label: "Total Usage",
        data: salesData,
        backgroundColor: "rgba(96, 165, 250, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Product Name" },
      },
      y: {
        title: { display: true, text: "Total Usage" },
      },
    },
  };

  const handleBack = () => navigate(-1);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
    setStartDate("");
    setEndDate("");
  };

  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      loadTrendData();
    } else {
      alert("Please select a valid custom date range.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        🔙 Back
      </button>

      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
        📊 Product Usage Report
      </h2>

      <div className="mb-6 space-y-3">
        <label className="block text-lg font-medium">
          Select Time Range:
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="ml-2 border rounded px-3 py-1"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Custom Range">Custom Range</option>
          </select>
        </label>

        {timeRange === "Custom Range" && (
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div>
              <label className="block">
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="ml-2 border px-2 py-1 rounded"
                />
              </label>
            </div>
            <div>
              <label className="block">
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="ml-2 border px-2 py-1 rounded"
                />
              </label>
            </div>
            <button
              onClick={handleCustomDateRange}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              ✅ Apply
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading chart data...</p>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">📈 Bar Chart of Product Usage</h3>
          <div className="bg-white rounded-lg shadow p-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductUsage;
