import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AllLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [view, setView] = useState("table");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const baseUrl = user?.role === "Admin" ? "/leave/all" : "/leave/my";

      const url = filter ? `${baseUrl}?status=${filter}` : baseUrl;

      const res = await API.get(url);
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const getDays = (start, end) => {
    return (
      Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)) + 1
    );
  };

  const getAppliedDaysAgo = (createdAt) => {
    return Math.floor(
      (new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 border-green-300 text-green-700";
      case "Rejected":
        return "bg-red-100 border-red-300 text-red-700";
      default:
        return "bg-yellow-100 border-yellow-300 text-yellow-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* 🔝 Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {user?.role === "Admin" ? "Admin Panel" : "My Leaves"}
          </h1>
          <p className="text-gray-500">Smart leave tracking & insights</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
          >
            Table
          </Button>

          <Button
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => setView("calendar")}
          >
            Calendar
          </Button>

          <Button onClick={() => navigate("/apply")}>+ Apply Leave</Button>
        </div>
      </div>

      {/* 🎛 Filters */}
      <div className="flex gap-2 flex-wrap">
        {["", "Pending", "Approved", "Rejected"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
          >
            {f || "All"}
          </Button>
        ))}
      </div>

      {/* 📅 CALENDAR VIEW */}
      {view === "calendar" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {leaves.map((leave) => {
            const daysAgo = getAppliedDaysAgo(leave.createdAt);
            const needsFollowUp = leave.status === "Pending" && daysAgo > 2;

            return (
              <Card
                key={leave._id}
                className={`border-l-4 ${getStatusStyle(
                  leave.status
                )} hover:shadow-md transition`}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{leave.reason}</span>
                    <span className="text-xs font-medium">{leave.status}</span>
                  </div>

                  <p className="text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} →{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </p>

                  <p className="text-sm">
                    {getDays(leave.startDate, leave.endDate)} days
                  </p>

                  <p className="text-xs text-gray-400">
                    Applied {daysAgo} days ago
                  </p>

                  {needsFollowUp && (
                    <span className="text-xs text-red-500 font-medium">
                      ⚠ Follow up needed
                    </span>
                  )}

                  <p className="text-xs text-gray-500">
                    {user?.role === "Admin"
                      ? `Employee: ${leave.user?.name || "Unknown"}`
                      : "Applied to Manager"}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* 📋 TABLE VIEW */
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hint</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6}>Loading...</TableCell>
                </TableRow>
              ) : leaves.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No leaves found
                  </TableCell>
                </TableRow>
              ) : (
                leaves.map((leave) => {
                  const daysAgo = getAppliedDaysAgo(leave.createdAt);
                  const needsFollowUp =
                    leave.status === "Pending" && daysAgo > 2;

                  return (
                    <TableRow key={leave._id}>
                      <TableCell>
                        {new Date(leave.startDate).toLocaleDateString()} →{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        {getDays(leave.startDate, leave.endDate)}
                      </TableCell>

                      <TableCell>{daysAgo} days ago</TableCell>

                      <TableCell>
                        {user?.role === "Admin"
                          ? leave.user?.name || "Employee"
                          : "Manager"}
                      </TableCell>

                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            leave.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : leave.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </TableCell>

                      <TableCell>
                        {needsFollowUp ? (
                          <span className="text-red-500 text-xs">
                            ⚠ Follow up
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
