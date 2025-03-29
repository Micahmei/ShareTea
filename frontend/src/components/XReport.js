import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const XReport = () => {
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);
  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/xreport", {
        params: {
          startHour,
          endHour,
        },
      });
      setReportData(response.data);
    } catch (err) {
      alert("❌ Failed to fetch report data.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        🔙 Back
      </button>

      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        📊 X-Report - Hourly Sales Breakdown
      </h2>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 justify-center">
        <label className="flex items-center gap-2">
          Start Hour:
          <select
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          End Hour:
          <select
            value={endHour}
            onChange={(e) => setEndHour(parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour}>
                {hour}:00
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleGenerateReport}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          ✅ Generate Report
        </button>
      </div>

      {reportData.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Report Data</h3>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Hour</th>
                <th className="px-3 py-2 border">Transactions</th>
                <th className="px-3 py-2 border">Sales Revenue ($)</th>
                <th className="px-3 py-2 border">Total Sales ($)</th>
                <th className="px-3 py-2 border">Returns ($)</th>
                <th className="px-3 py-2 border">Drinks Sold</th>
                <th className="px-3 py-2 border">Voids ($)</th>
                <th className="px-3 py-2 border">Discards ($)</th>
                <th className="px-3 py-2 border">Payment Methods</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border text-center">{row.hour}</td>
                  <td className="px-3 py-2 border text-center">{row.total_transactions}</td>
                  <td className="px-3 py-2 border text-center">{Number(row.sales_revenue).toFixed(2)}</td>
                  <td className="px-3 py-2 border text-center">{Number(row.total_sales).toFixed(2)}</td>
                  <td className="px-3 py-2 border text-center">{Number(row.total_returns).toFixed(2)}</td>
                  <td className="px-3 py-2 border text-center">{row.drink_sales}</td>
                  <td className="px-3 py-2 border text-center">{Number(row.voids).toFixed(2)}</td>
                  <td className="px-3 py-2 border text-center">{Number(row.discards).toFixed(2)}</td>
                  <td className="px-3 py-2 border text-center">{row.payment_methods || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default XReport;
