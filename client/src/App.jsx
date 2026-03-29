import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/employee/Dashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import AllLeaves from "./pages/employee/AllLeaves";
import Profile from "./pages/Profile";

// NEW PAGES
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Approvals from "./pages/manager/Approvals";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Login />} />

          {/* COMMON (ALL ROLES) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["Employee", "Manager", "Admin"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={["Employee", "Manager", "Admin"]}>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* EMPLOYEE */}
          <Route
            path="/apply"
            element={
              <ProtectedRoute roles={["Employee"]}>
                <Layout>
                  <ApplyLeave />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/leaves"
            element={
              <ProtectedRoute roles={["Employee", "Admin", "Manager"]}>
                <Layout>
                  <AllLeaves />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* MANAGER */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute roles={["Manager"]}>
                <Layout>
                  <Approvals />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute roles={["Admin"]}>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
