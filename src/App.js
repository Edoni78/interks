import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminLogin } from './admin/AdminLogin';
import { CompleteProfile } from './admin/CompleteProfile';
import { ProtectedRoute } from './admin/ProtectedRoute';
import { RequireCompleteProfile } from './admin/RequireCompleteProfile';
import Landing from './pages/Landing';
import Learn from './pages/Learn';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/learn/:slug" element={<Learn />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Navigate to="/login?mode=signup" replace />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <RequireCompleteProfile>
                <AdminDashboard />
              </RequireCompleteProfile>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
