import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Employee = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    viewEmployees();
  }, []);

  const viewEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/employees");
      setEmployeeList(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const addEmployee = async () => {
    try {
      await axios.post("http://localhost:5050/api/employees", {
        employeename: name,
        employeepassword: password,
        employeetype: role,
      });
      alert("✅ Employee added successfully!");
      viewEmployees();
    } catch (error) {
      console.error("Failed to add employee:", error);
    }
  };

  const updateEmployee = async () => {
    try {
      await axios.put(`http://localhost:5050/api/employees/${id}`, {
        employeename: name,
        employeepassword: password,
        employeetype: role,
      });
      alert("✅ Employee updated successfully!");
      viewEmployees();
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  const deleteEmployee = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/employees/${id}`);
      alert("✅ Employee deleted successfully!");
      viewEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">👥 Employee Management</h2>

      <div className="bg-white shadow-md rounded p-6 mb-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Employee ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Employee Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Employee Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={addEmployee} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            ➕ Add
          </button>
          <button onClick={updateEmployee} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            🔄 Update
          </button>
          <button onClick={deleteEmployee} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded p-6 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">📋 Employee List</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((emp) => (
                <tr key={emp.employeeid} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">{emp.employeeid}</td>
                  <td className="border px-4 py-2">{emp.employeename}</td>
                  <td className="border px-4 py-2">{emp.employeetype}</td>
                </tr>
              ))}
              {employeeList.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/manager")}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ⬅️ Back to Manager
        </button>
      </div>
    </div>
  );
};

export default Employee;
