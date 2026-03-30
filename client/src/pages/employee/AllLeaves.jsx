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

export default function AllLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const isPrivileged = ["Admin", "Manager"].includes(user?.role);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const baseUrl = isPrivileged ? "/leave/all" : "/leave/my";
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

  // 🔥 Approve / Reject (Manager only)
  const handleDecision = async (id, decision) => {
    try {
      await API.put(`/leave/${id}/decision`, { status: decision });
      toast.success(`Leave ${decision}`);
      fetchLeaves();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            {user?.role === "Admin"
              ? "All Leaves"
              : user?.role === "Manager"
              ? "Team Leaves"
              : "My Leaves"}
          </h1>

          <p className="text-sm text-muted-foreground">
            {isPrivileged
              ? "Manage employee leave requests"
              : "View your leave requests"}
          </p>
        </div>

        {!isPrivileged && (
          <Button onClick={() => navigate("/apply")}>Apply Leave</Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
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

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {isPrivileged && (
                <TableHead className="font-bold">Employee</TableHead>
              )}
              <TableHead className="font-bold">Start</TableHead>
              <TableHead className="font-bold">End</TableHead>
              <TableHead className="font-bold">Reason</TableHead>
              <TableHead className="font-bold">Status</TableHead>

              {/* 🔥 Action column only for Manager */}
              {user?.role === "Manager" && (
                <TableHead className="font-bold">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            ) : leaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No leaves found
                </TableCell>
              </TableRow>
            ) : (
              leaves.map((leave) => (
                <TableRow key={leave._id}>
                  {/* 👤 Employee Name */}
                  {isPrivileged && (
                    <TableCell>{leave.userId?.name || "Unknown"}</TableCell>
                  )}

                  <TableCell>
                    {new Date(leave.startDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    {new Date(leave.endDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>{leave.reason}</TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
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

                  {/* 🔥 Actions for Manager */}
                  {user?.role === "Manager" && (
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleDecision(leave._id, "Approved")}
                      >
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDecision(leave._id, "Rejected")}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
