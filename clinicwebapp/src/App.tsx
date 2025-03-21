import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import AppointmentDetail from './pages/AppointmentDetail';
import StaffList from './pages/StaffList';
import NewStaff from './pages/NewStaff';
import EditStaff from './pages/EditStaff';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create new components for autobebesys pages with Suspense for code splitting
const HomePage = React.lazy(() => import('./pages/autobebesys/Home'));
const BlogPage = React.lazy(() => import('./pages/autobebesys/Blog'));
const JoyTriagePage = React.lazy(() => import('./pages/autobebesys/JoyTriage'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Set Autobebesys Home as the default landing page */}
            <Route path="/" element={
              <Layout>
                <HomePage />
              </Layout>
            } />
            
            <Route path="/login" element={<LoginPage />} />
            
            {/* Signup route that redirects to login */}
            <Route path="/joytriage/signup" element={<Navigate to="/login" replace />} />
            
            {/* Autobebesys Public Routes */}
            <Route path="/blog" element={
              <Layout>
                <BlogPage />
              </Layout>
            } />
            <Route path="/joytriage" element={
              <Layout>
                <JoyTriagePage />
              </Layout>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Layout>
                  <Appointments />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/appointments/:id" element={
              <ProtectedRoute>
                <Layout>
                  <AppointmentDetail />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Staff Management Routes */}
            <Route path="/staff" element={
              <ProtectedRoute>
                <Layout>
                  <StaffList />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/staff/new" element={
              <ProtectedRoute>
                <Layout>
                  <NewStaff />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/staff/:id" element={
              <ProtectedRoute>
                <Layout>
                  <EditStaff />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* User Account Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
