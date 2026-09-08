import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import CitizenLayout from "../layouts/CitizenLayout";
import AdminLayout from "../layouts/AdminLayout";

import LandingPage from "../pages/LandingPage";

import CitizenLogin from "../pages/auth/CitizenLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import CitizenRegister from "../pages/auth/CitizenRegister";

import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import AnnouncementsPage from "../pages/citizen/AnnouncementsPage";
import DirectoryPage from "../pages/citizen/DirectoryPage";
import EmergencyPage from "../pages/citizen/EmergencyPage";
import GrievancesPage from "../pages/citizen/GrievancesPage";
import ProfilePage from "../pages/citizen/ProfilePage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AnnouncementsAdmin from "../pages/admin/AnnouncementsAdmin";
import DirectoryAdmin from "../pages/admin/DirectoryAdmin";
import EmergencyAdmin from "../pages/admin/EmergencyAdmin";
import GrievancesAdmin from "../pages/admin/GrievancesAdmin";
import AdminLandingEditor from "../pages/admin/AdminLandingEditor";
import HistoryPage from "../pages/admin/LandingHistory";

import ProtectedRoute from "./ProtectedRoute";

const CITIZEN = ["citizen"];

const ADMIN = [
  "admin",
  "staff"
];

export default function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route
        path="/"
        element={
          <MainLayout>
            <LandingPage />
          </MainLayout>
        }
      />

      <Route
        path="/login"
        element={<CitizenLogin />}
      />

      <Route
        path="/register"
        element={<CitizenRegister />}
      />

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      {/* ================= CITIZEN ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={CITIZEN}>
            <CitizenLayout>
              <CitizenDashboard />
            </CitizenLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/announcements"
        element={
          <ProtectedRoute allowedRoles={CITIZEN}>
            <CitizenLayout>
              <AnnouncementsPage />
            </CitizenLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/directory"
        element={
          <ProtectedRoute allowedRoles={CITIZEN}>
            <CitizenLayout>
              <DirectoryPage />
            </CitizenLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/emergency"
        element={
          <ProtectedRoute allowedRoles={CITIZEN}>
            <CitizenLayout>
              <EmergencyPage />
            </CitizenLayout>
          </ProtectedRoute>
        }
      />
      

      <Route
        path="/dashboard/grievances"
        element={
          <ProtectedRoute allowedRoles={CITIZEN}>
            <CitizenLayout>
              <GrievancesPage />
            </CitizenLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute allowedRoles={CITIZEN}>
            <CitizenLayout>
              <ProfilePage />
            </CitizenLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/landing"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <AdminLayout>
              <AdminLandingEditor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <AdminLayout>
              <AnnouncementsAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/directory"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <AdminLayout>
              <DirectoryAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/emergency"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <AdminLayout>
              <EmergencyAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/grievances"
        element={
          <ProtectedRoute allowedRoles={ADMIN}>
            <AdminLayout>
              <GrievancesAdmin />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
  path="/admin/landing/history"
  element={
    <ProtectedRoute allowedRoles={ADMIN}>
      <AdminLayout>
        <HistoryPage />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

      

      {/* ================= FALLBACK ================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}