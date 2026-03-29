import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import API from "@/lib/api";
import { toast } from "react-toastify";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { User, Shield } from "lucide-react";

export default function Profile() {
  const { user, login } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Profile validation
  const validateProfile = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    return newErrors;
  };

  // ✅ Password validation
  const validatePassword = () => {
    const newErrors = {};

    if (!passwords.current) newErrors.current = "Current password is required";

    if (!passwords.new) {
      newErrors.new = "New password is required";
    } else if (passwords.new.length < 6) {
      newErrors.new = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // 🔥 Update Profile
  const handleUpdateProfile = async () => {
    const validationErrors = validateProfile();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await API.put("/users/me", { name, email });

      toast.success("Profile updated successfully ✅");

      login({
        token: localStorage.getItem("token"),
        user: res.data,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Change Password
  const handleChangePassword = async () => {
    const validationErrors = validatePassword();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await API.put("/users/change-password", passwords);

      toast.success("Password updated successfully 🔐");
      setPasswords({ current: "", new: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex gap-8 py-6">
      {/* SIDEBAR */}
      <div className="w-64">
        <div className="space-y-2">
          <button
            onClick={() => {
              setActiveTab("profile");
              setErrors({});
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition 
              ${
                activeTab === "profile"
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
          >
            <User size={18} />
            Profile
          </button>

          <button
            onClick={() => {
              setActiveTab("security");
              setErrors({});
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition 
              ${
                activeTab === "security"
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
          >
            <Shield size={18} />
            Security
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Account Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* PROFILE */}
        {activeTab === "profile" && (
          <Card className="rounded-2xl border shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-muted-foreground">
                  Update your personal details here
                </p>
              </div>

              <div className="grid gap-5">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Name
                  </label>
                  <Input
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-11 rounded-xl"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Email
                  </label>
                  <Input
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-11 rounded-xl"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Role
                  </label>
                  <Input
                    value={user?.role}
                    disabled
                    className="mt-1 h-11 rounded-xl bg-muted"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="h-11 rounded-xl px-6"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SECURITY */}
        {activeTab === "security" && (
          <Card className="rounded-2xl border shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-semibold">Password</h2>
                <p className="text-sm text-muted-foreground">
                  Change your password to keep your account secure
                </p>
              </div>

              <div className="grid gap-5">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={passwords.current}
                    placeholder="Enter current password"
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        current: e.target.value,
                      })
                    }
                    className="mt-1 h-11 rounded-xl"
                  />
                  {errors.current && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.current}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground">
                    New Password
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        new: e.target.value,
                      })
                    }
                    className="mt-1 h-11 rounded-xl"
                  />
                  {errors.new && (
                    <p className="text-sm text-red-500 mt-1">{errors.new}</p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="h-11 rounded-xl px-6"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
