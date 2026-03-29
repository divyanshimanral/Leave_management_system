import { useEffect, useState } from "react";
import API from "@/lib/api";
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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

import { useAuth } from "@/context/AuthContext";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 Change Role
  const handleRoleChange = async (id, role) => {
    try {
      await API.put(`/admin/${id}/role`, { role });
      toast.success("Role updated ✅");
      fetchUsers();
    } catch {
      toast.error("Failed to update role ❌");
    }
  };

  // 🔥 Delete User
  const handleDelete = async () => {
    if (deleteUserId === currentUser._id) {
      toast.error("You cannot delete yourself ❌");
      return;
    }

    try {
      await API.delete(`/admin/${deleteUserId}`);
      toast.success("User deleted 🗑️");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user ❌");
    } finally {
      setDeleteUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage users, roles and access
        </p>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader className="font-semibold">
            <TableRow>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={4}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>

                  {/* 🔥 Role Dropdown (FIXED) */}
                  <TableCell>
                    <Select
                      defaultValue={u.role}
                      onValueChange={(value) => handleRoleChange(u._id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>

                      {/* 🔥 FIX: prevent overlap */}
                      <SelectContent className="z-50">
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* 🔥 Actions */}
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteUserId(u._id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the user.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
