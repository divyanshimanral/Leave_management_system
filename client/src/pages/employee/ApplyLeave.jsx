import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ApplyLeave() {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!reason.trim()) newErrors.reason = "Reason is required";

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date cannot be before start date";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // 🔥 FIXED API
      await API.post("/leave", {
        startDate,
        endDate,
        reason,
      });

      toast.success("Leave applied successfully ✅");

      // Reset form
      setStartDate("");
      setEndDate("");
      setReason("");

      // 🔥 Redirect to leaves page
      setTimeout(() => {
        navigate("/leaves");
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying leave ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-start justify-center">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Apply Leave</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details to request leave
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="glass rounded-2xl">
            <CardContent className="p-6 space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    className="h-11 rounded-xl glass"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1 block">
                    End Date
                  </label>
                  <Input
                    type="date"
                    className="h-11 rounded-xl glass"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-semibold mb-1 block">
                  Reason
                </label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for leave..."
                  className="h-11 rounded-xl glass"
                />
                {errors.reason && (
                  <p className="text-sm text-red-500 mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl text-base"
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
