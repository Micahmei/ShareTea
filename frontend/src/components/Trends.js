import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5050";
// 注册 Chart.js 组件
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Trends = () => {
  const [salesData, setSalesData] = useState([]);
  const [dateLabels, setDateLabels] = useState([]);
  const [currentTrend, setCurrentTrend] = useState("Daily Sales");
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendData(currentTrend);
  }, [currentTrend, timeRange]);

  const loadTrendData = async (trendType) => {
    try {
      const response = await axios.get(`${apiUrl}/api/trends`, {
        params: {
          trendType,
          timeRange,
        },
      });
      const trendData = response.data;
      setSalesData(trendData.map((item) => item.total_amount || item.order_count || item.used_quantity));
      setDateLabels(trendData.map((item) => item.date || item.usage_date));
    } catch (err) {
      console.error("Error fetching trend data:", err);
      alert("❌ Failed to fetch trend data.");
    }
  };

  const chartData = {
    labels: dateLabels,
    datasets: [
      {
        label: currentTrend,
        data: salesData,
        fill: false,
        borderColor: "rgb(34 197 94)", // 绿色
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">📊 Trends Report</h2>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-4">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-semibold">Select Trend Type</h3>
          <div className="flex flex-wrap gap-2">
            {["Daily Sales", "Peak Days", "Total Orders", "Product Usage"].map((type) => (
              <button
                key={type}
                onClick={() => setCurrentTrend(type)}
                className={`px-4 py-2 rounded border ${
                  currentTrend === type
                    ? "bg-green-600 text-white"
                    : "bg-white text-green-700 border-green-400"
                } hover:bg-green-100`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-semibold">Select Time Range</h3>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md p-4 rounded mb-6">
        <h3 className="font-semibold mb-2">📈 Data Chart</h3>
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="bg-white shadow-md p-4 rounded">
        <h3 className="font-semibold mb-2">📋 Trend Data</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {dateLabels.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center text-gray-500 py-4">
                    No trend data available
                  </td>
                </tr>
              ) : (
                dateLabels.map((date, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{date}</td>
                    <td className="border px-4 py-2">{salesData[index]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/manager")}
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ⬅️ Back to Manager
        </button>
      </div>
    </div>
  );
};

export default Trends;
