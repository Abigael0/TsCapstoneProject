import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import AppShell from "../components/AppShell";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import UserDashboard from "../pages/UserDashboard";
import SubmitComplaint from "../pages/SubmitComplaint";
import MyComplaints from "../pages/MyComplaints";
import ComplaintDetails from "../pages/ComplaintDetails";

import AdminDashboard from "../pages/AdminDashboard";
import Users from "../pages/Users";
import Profile from "../pages/Profile";

import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p>Loading...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AuthPage({ children }) {
  const { isAuthenticated, currentUser } = useAuth();

  if (isAuthenticated) {
    return (
      <Navigate
        to={
          currentUser?.role === "admin"
            ? "/admin"
            : "/dashboard"
        }
        replace
      />
    );
  }

  return children;
}

function UserLayout({ children }) {
  const { currentUser, logout } = useAuth();

  return (
    <AppShell
      user={currentUser}
      onLogout={logout}
    >
      {children}
    </AppShell>
  );
}

export default function AppRoutes() {
  const navigate = useNavigate();

  const {
    currentUser,
    login,
    register,
  } = useAuth();

  /*
   * Temporary frontend data source.
   * Once the backend is connected, complaints should come from
   * the backend instead of being maintained inside AppRoutes.
   */
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    async function loadComplaints() {
      try {
        const data = await api.getComplaints();
        setComplaints(data);
      } catch (error) {
        console.error("Unable to load complaints:", error);
      }
    }

    if (currentUser) {
      loadComplaints();
    }
  }, [currentUser]);

  async function handleComplaintSubmit(data) {
    try {
      const complaint = await api.createComplaint(data);

      setComplaints((previous) => [
        complaint,
        ...previous,
      ]);

      return complaint;
    } catch (error) {
      console.error(
        "Unable to create complaint:",
        error
      );

      throw error;
    }
  }

  function viewComplaint(complaint) {
    navigate(`/complaints/${complaint.id}`);
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <AuthPage>
            <Login onLogin={login} />
          </AuthPage>
        }
      />

      <Route
        path="/register"
        element={
          <AuthPage>
            <Register onRegister={register} />
          </AuthPage>
        }
      />

      {/* User */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserLayout>
              <UserDashboard
                user={currentUser}
                complaints={complaints}
                onNewComplaint={() =>
                  navigate("/complaints/new")
                }
                onViewComplaint={viewComplaint}
              />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/new"
        element={
          <ProtectedRoute>
            <UserLayout>
              <SubmitComplaint
                onSubmit={handleComplaintSubmit}
              />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <UserLayout>
              <MyComplaints
                user={currentUser}
                complaints={complaints}
                onViewComplaint={viewComplaint}
              />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints/:id"
        element={
          <ProtectedRoute>
            <UserLayout>
              <ComplaintDetails
                user={currentUser}
                complaints={complaints}
              />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserLayout>
              <Profile user={currentUser} />
            </UserLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <UserLayout>
              <AdminDashboard />
            </UserLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserLayout>
              <Users />
            </UserLayout>
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}