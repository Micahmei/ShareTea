import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl =
  process.env.REACT_APP_API_URL || "http://localhost:5050";
const ZReport = () => {
  const [startHour, setStartHour] = useState(0);
  const [endHour, setEndHour] = useState(23);
  const [reportData, setReportData] = useState([]);
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchReportData = async () => {
    if (startHour > endHour) {
      alert('Start hour cannot be greater than end hour');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/zreport?startHour=${startHour}&endHour=${endHour}`);
      setReportData(response.data);
      prepareCSVData(response.data);
    } catch (error) {
      console.error('❌ Error fetching Z-report data:', error);
      alert('⚠️ Failed to fetch Z-report data. Check the backend or console.');
    } finally {
      setLoading(false);
    }
  };

  const prepareCSVData = (data) => {
    const headers = [
      "Hour", "Transactions", "Sales Revenue", "Total Sales",
      "Total Tax", "Service Charges", "Voids", "Discards",
      "Discounts", "Employee Signatures", "Payment Methods"
    ];
    const rows = data.map(row => [
      row.hour,
      row.total_transactions,
      Number(row.sales_revenue).toFixed(2),
      Number(row.total_sales).toFixed(2),
      Number(row.total_tax).toFixed(2),
      Number(row.service_charges).toFixed(2),
      Number(row.voids).toFixed(2),
      Number(row.discards).toFixed(2),
      Number(row.discounts).toFixed(2),
      `"${row.employee_signatures || 'N/A'}"`,
      `"${row.payment_methods || 'N/A'}"`
    ].join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    setCsvData(csv);
  };

  const handleExportToCSV = () => {
    if (!csvData) {
      alert("No data to export");
      return;
    }

    const blob = new Blob([csvData], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Z_Report.csv';
    link.click();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Z-Report - Hourly Sales Breakdown
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <div>
          <label className="block mb-1 font-semibold">Start Hour:</label>
          <input
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(parseInt(e.target.value))}
            min="0"
            max="23"
            className="border border-gray-300 rounded px-3 py-2 w-32"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">End Hour:</label>
          <input
            type="number"
            value={endHour}
            onChange={(e) => setEndHour(parseInt(e.target.value))}
            min="0"
            max="23"
            className="border border-gray-300 rounded px-3 py-2 w-32"
          />
        </div>
        <button
          onClick={fetchReportData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          Generate Report
        </button>
        <button
          onClick={handleExportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          Export to CSV
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-semibold"
        >
          Back
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                {[
                  "Hour", "Transactions", "Sales Revenue", "Total Sales",
                  "Total Tax", "Service Charges", "Voids", "Discards",
                  "Discounts", "Employee Signatures", "Payment Methods"
                ].map((header, idx) => (
                  <th key={idx} className="px-4 py-2 whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-4 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                reportData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{row.hour}</td>
                    <td className="px-4 py-2">{row.total_transactions}</td>
                    <td className="px-4 py-2">{Number(row.sales_revenue).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(row.total_sales).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(row.total_tax).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(row.service_charges).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(row.voids).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(row.discards).toFixed(2)}</td>
                    <td className="px-4 py-2">{Number(row.discounts).toFixed(2)}</td>
                    <td className="px-4 py-2">{row.employee_signatures || 'N/A'}</td>
                    <td className="px-4 py-2">{row.payment_methods || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ZReport;
