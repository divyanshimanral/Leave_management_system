import { useEffect, useState } from "react";
import API from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#22c55e", "#f59e0b", "#ef4444"];

export default function Reports() {
  const [monthly, setMonthly] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get("/reports/monthly").then((res) => setMonthly(res.data));
    API.get("/reports/status").then((res) => setStatus(res.data));
    API.get("/reports/users").then((res) => setUsers(res.data));
  }, []);

  // 📤 Export
  const exportCSV = () => {
    const csv = [["Month", "Leaves"], ...monthly.map((d) => [d._id, d.total])];

    const blob = new Blob([csv.map((e) => e.join(",")).join("\n")], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "monthly_report.csv";
    a.click();
  };

  // 📊 KPIs
  const totalLeaves = monthly.reduce((acc, curr) => acc + curr.total, 0);
  const approved = status.find((s) => s._id === "Approved")?.count || 0;
  const pending = status.find((s) => s._id === "Pending")?.count || 0;
  const rejected = status.find((s) => s._id === "Rejected")?.count || 0;

  return (
    <div className="space-y-6">
      {/* 🔝 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>

      {/* 📊 KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Leaves</p>
          <h2 className="text-xl font-bold">{totalLeaves}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <p>Approved</p>
          <h2 className="text-xl font-bold">{approved}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <p>Pending</p>
          <h2 className="text-xl font-bold">{pending}</h2>
        </div>

        <div className="bg-red-100 p-4 rounded shadow">
          <p>Rejected</p>
          <h2 className="text-xl font-bold">{rejected}</h2>
        </div>
      </div>

      {/* 📊 Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* 📈 Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Monthly Leave Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                label={{ value: "Month", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "Leaves", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📉 Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Trend Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                label={{ value: "Month", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                label={{ value: "Leaves", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🟢 Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Leave Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={status}
                dataKey="count"
                nameKey="_id"
                outerRadius={100}
              >
                {status.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 👤 User Activity */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">User Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={users}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                label={{
                  value: "User ID",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                label={{ value: "Leaves", angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Bar dataKey="totalLeaves" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
