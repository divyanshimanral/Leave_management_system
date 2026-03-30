import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ApplyLeave() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 📅 Today date (for validation)
  const today = new Date().toISOString().split("T")[0];

  // ✅ Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation
  const validate = () => {
    const newErrors = {};

    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.reason.trim()) newErrors.reason = "Reason is required";
    if (!form.leaveType) newErrors.leaveType = "Leave type is required";

    // 🚫 Past date restriction
    if (form.startDate && form.startDate < today) {
      newErrors.startDate = "Start date cannot be in the past";
    }

    // 🚫 End < Start
    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      newErrors.endDate = "End date cannot be before start date";
    }

    // 🚫 Max duration (optional but impressive)
    const diff =
      (new Date(form.endDate) - new Date(form.startDate)) /
      (1000 * 60 * 60 * 24);

    if (diff > 10) {
      newErrors.endDate = "Leave cannot exceed 10 days";
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
      await API.post("/leave", form);

      toast.success("Leave applied successfully ✅");

      setForm({
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "",
      });

      setTimeout(() => {
        navigate("/track-leaves");
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
        {/* 🔝 Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Apply Leave</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details to request leave
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="rounded-2xl shadow">
            <CardContent className="p-6 space-y-6">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Start Date</label>
                  <Input
                    type="date"
                    name="startDate"
                    min={today}
                    value={form.startDate}
                    onChange={handleChange}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">{errors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold">End Date</label>
                  <Input
                    type="date"
                    name="endDate"
                    min={form.startDate || today}
                    value={form.endDate}
                    onChange={handleChange}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="text-sm font-semibold">Leave Type</label>
                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Casual">Casual Leave</option>
                  <option value="Paid">Paid Leave</option>
                </select>

                {errors.leaveType && (
                  <p className="text-red-500 text-sm">{errors.leaveType}</p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="text-sm font-semibold">Reason</label>
                <Input
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Enter reason..."
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm">{errors.reason}</p>
                )}
              </div>

              {/* Submit */}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
