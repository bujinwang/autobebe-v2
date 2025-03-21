import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
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
const AboutPage = React.lazy(() => import('./pages/autobebesys/About'));
const ContactPage = React.lazy(() => import('./pages/autobebesys/Contact'));
const DemoPage = React.lazy(() => import('./pages/autobebesys/Demo'));
const PlatformsPage = React.lazy(() => import('./pages/autobebesys/Platforms'));

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
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            } />
            
            <Route path="/login" element={<LoginPage />} />
            
            {/* Signup route that redirects to login */}
            <Route path="/joytriage/signup" element={<Navigate to="/login" replace />} />
            
            <Route path="/blog" element={
              <PublicLayout>
                <BlogPage />
              </PublicLayout>
            } />
            <Route path="/joytriage" element={
              <PublicLayout>
                <JoyTriagePage />
              </PublicLayout>
            } />
            <Route path="/about" element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            } />
            <Route path="/contact" element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            } />
            <Route path="/demo" element={
              <PublicLayout>
                <DemoPage />
              </PublicLayout>
            } />
            <Route path="/platforms" element={
              <PublicLayout>
                <PlatformsPage />
              </PublicLayout>
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
            
            {/* User Routes */}
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
