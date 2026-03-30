import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LeavePolicies() {
  const [policy, setPolicy] = useState({
    annualLeaves: 24,
    sickLeaves: 10,
    casualLeaves: 8,
    maxLeavesPerRequest: 5,
    carryForward: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicy({
      ...policy,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    console.log("Saved Policy:", policy);
    alert("Policy saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* 🔝 Header */}
      <div>
        <h1 className="text-2xl font-bold">Leave Policy Configuration</h1>
        <p className="text-gray-500">
          Configure leave rules and policies for employees
        </p>
      </div>

      {/* 📋 Form */}
      <Card className="shadow">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Annual Leaves</label>
              <Input
                name="annualLeaves"
                value={policy.annualLeaves}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm">Sick Leaves</label>
              <Input
                name="sickLeaves"
                value={policy.sickLeaves}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm">Casual Leaves</label>
              <Input
                name="casualLeaves"
                value={policy.casualLeaves}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="text-sm">Max Leaves Per Request</label>
              <Input
                name="maxLeavesPerRequest"
                value={policy.maxLeavesPerRequest}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="carryForward"
              checked={policy.carryForward}
              onChange={handleChange}
            />
            <label>Allow Carry Forward</label>
          </div>

          {/* Save */}
          <Button onClick={handleSave} className="w-full">
            Save Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
