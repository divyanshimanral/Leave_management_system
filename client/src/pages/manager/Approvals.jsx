import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Approvals() {
  const [leaves, setLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionType, setActionType] = useState(""); // Approved / Rejected

  const fetchLeaves = async () => {
    try {
      const res = await API.get("/leave/team?status=pending");
      setLeaves(res.data);
    } catch {
      toast.error("Failed to load leaves ❌");
    }
  };

  const handleDecision = async () => {
    try {
      await API.put(`/leave/${selectedLeave}/decision`, {
        status: actionType,
      });

      toast.success(
        `Leave ${actionType === "Approved" ? "approved ✅" : "rejected ❌"}`
      );

      fetchLeaves();
    } catch {
      toast.error("Action failed ❌");
    } finally {
      setSelectedLeave(null);
      setActionType("");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pending Leaves</h1>
        <p className="text-sm text-muted-foreground">
          Review and take action on pending leave requests
        </p>
      </div>

      {leaves.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending requests 🎉</p>
      ) : (
        leaves.map((l) => (
          <div
            key={l._id}
            className="p-5 border rounded-2xl flex justify-between items-center bg-background shadow-sm"
          >
            {/* Info */}
            <div>
              <p className="font-semibold">{l.userId.name}</p>
              <p className="text-sm text-muted-foreground">{l.reason}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {/* APPROVE */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setSelectedLeave(l._id);
                      setActionType("Approved");
                    }}
                  >
                    Approve
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Leave Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this leave request?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction onClick={handleDecision}>
                      Approve
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* REJECT */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedLeave(l._id);
                      setActionType("Rejected");
                    }}
                  >
                    Reject
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Leave Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this leave request?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={handleDecision}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Reject
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
