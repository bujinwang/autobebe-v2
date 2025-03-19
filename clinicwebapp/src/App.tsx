import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import AppointmentDetail from './pages/AppointmentDetail';
import StaffList from './pages/StaffList';
import NewStaff from './pages/NewStaff';
import EditStaff from './pages/EditStaff';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Set Login as the default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          } />
          <Route path="/appointments/:id" element={
            <ProtectedRoute>
              <AppointmentDetail />
            </ProtectedRoute>
          } />
          
          {/* Staff Management Routes */}
          <Route path="/staff" element={
            <ProtectedRoute>
              <StaffList />
            </ProtectedRoute>
          } />
          <Route path="/staff/new" element={
            <ProtectedRoute>
              <NewStaff />
            </ProtectedRoute>
          } />
          <Route path="/staff/:id" element={
            <ProtectedRoute>
              <EditStaff />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
