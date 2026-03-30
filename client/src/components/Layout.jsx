import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  Users,
  BarChart3,
  CheckCircle,
  LogOut,
  User,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 FULL RBAC MENU
  const menu = {
    Employee: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Apply Leave",
        path: "/apply",
        icon: FilePlus,
      },
      {
        label: "My Leaves",
        path: "/leaves",
        icon: ClipboardList,
      },
      {
        label: "Track Leaves",
        path: "/track-leaves",
        icon: ClipboardList,
      },
    ],

    Manager: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },

      {
        label: "All Employees Leaves",
        path: "/leaves",
        icon: ClipboardList,
      },
      {
        label: "Approvals",
        path: "/approvals",
        icon: CheckCircle,
      },
    ],

    Admin: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "All Leaves",
        path: "/leaves",
        icon: ClipboardList,
      },
      {
        label: "Leave Policies",
        path: "/leave-policies",
        icon: ClipboardList,
      },
      {
        label: "Users",
        path: "/users",
        icon: Users,
      },
      {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
      },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 🔥 Better page title
  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/") return "Dashboard";
    if (path.includes("apply")) return "Apply Leave";
    if (path.includes("leaves")) return "Leaves";
    if (path.includes("users")) return "User Management";
    if (path.includes("reports")) return "Reports";
    if (path.includes("approvals")) return "Approvals";
    if (path.includes("profile")) return "Profile";

    return "Dashboard";
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 p-5 border-r border-border glass">
        <h2 className="text-2xl font-semibold mb-8">LMS</h2>

        <nav className="space-y-2">
          {menu[user?.role]?.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer text-sm transition-all
                  ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-white/10 hover:text-foreground"
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-border glass">
          <div>
            <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="h-9 w-9 bg-primary/90 text-primary-foreground flex items-center justify-center rounded-full cursor-pointer text-sm font-semibold shadow-sm">
                  {user?.name?.charAt(0)}
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 p-1">
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <User size={16} />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer text-red-500"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
