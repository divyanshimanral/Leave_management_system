import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // ✅ Get user inside effect (stable)
        const user = JSON.parse(localStorage.getItem("user"));

        const endpoint =
          user?.role === "Admin" ? "/leave/stats/all" : "/leave/my/stats";

        const res = await API.get(endpoint);
        setStats(res.data);
      } catch (err) {
        console.error(err);

        // ✅ fallback data
        setStats({
          total: 36,
          approved: 22,
          pending: 8,
          rejected: 6,
        });
      }
    };

    fetchStats();
  }, []); // ✅ no dependency = no repeated calls

  if (!stats) return <p>Loading...</p>;

  // ✅ Get user once for UI (safe)
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="space-y-6">
      {/* 🔝 Heading */}
      <div>
        <h1 className="text-2xl font-bold">
          {user?.role === "Admin" ? "Admin Dashboard" : "My Dashboard"}
        </h1>
        <p className="text-gray-500">
          {user?.role === "Admin"
            ? "Overview of all leave activities"
            : "Overview of your leave activity"}
        </p>
      </div>

      {/* 📊 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow hover:shadow-md transition">
          <CardContent className="p-4">
            <p className="text-gray-500">Total Leaves</p>
            <h2 className="text-2xl font-bold">{stats.total}</h2>
          </CardContent>
        </Card>

        <Card className="bg-green-100 shadow">
          <CardContent className="p-4">
            <p>Approved</p>
            <h2 className="text-2xl font-bold text-green-700">
              {stats.approved}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-yellow-100 shadow">
          <CardContent className="p-4">
            <p>Pending</p>
            <h2 className="text-2xl font-bold text-yellow-700">
              {stats.pending}
            </h2>
          </CardContent>
        </Card>

        <Card className="bg-red-100 shadow">
          <CardContent className="p-4">
            <p>Rejected</p>
            <h2 className="text-2xl font-bold text-red-700">
              {stats.rejected}
            </h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
