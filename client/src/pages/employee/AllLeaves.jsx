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
  const [filter, setFilter] = useState(""); // 🔥 new

  const navigate = useNavigate();

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const url = filter ? `/leave/my?status=${filter}` : "/leave/my";

      const res = await API.get(url);
      setLeaves(res.data);
    } catch (err) {
      toast.error("Failed to fetch leaves", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [filter]); // 🔥 refetch on filter change

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">All Leaves</h1>
          <p className="text-sm text-muted-foreground">
            View all your leave requests
          </p>
        </div>

        <Button onClick={() => navigate("/apply")}>Apply Leave</Button>
      </div>

      {/* 🔥 Filters */}
      <div className="flex gap-2">
        {["", "pending", "approved", "rejected"].map((f) => (
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
      <div className="rounded-2xl border border-border glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Start Date</TableHead>
              <TableHead className="font-bold">End Date</TableHead>
              <TableHead className="font-bold">Reason</TableHead>
              <TableHead className="font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : leaves.length === 0 ? (
              <TableRow>
                <TableCell className="text-center py-6" colSpan={4}>
                  No leaves found
                </TableCell>
              </TableRow>
            ) : (
              leaves.map((leave) => (
                <TableRow key={leave._id}>
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
                          ? "bg-green-500/20 text-green-500"
                          : leave.status === "Rejected"
                          ? "bg-red-500/20 text-red-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
