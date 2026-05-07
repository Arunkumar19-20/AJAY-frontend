import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import RoleLayout from './components/RoleLayout';

// Shared
import Login from './pages/Login';
import Unauthorized from './pages/shared/Unauthorized';
import NotFound from './pages/shared/NotFound';
import Notifications from './pages/shared/Notifications';

// Centre
import CentreDashboard from './pages/centre/Dashboard';
import CentreStates from './pages/centre/States';
import CentreAgencies from './pages/centre/Agencies';
import CentreProjects from './pages/centre/Projects';
import CentreProjectDetail from './pages/centre/ProjectDetail';
import CentreFunds from './pages/centre/Funds';
import CentreFundRelease from './pages/centre/FundRelease';
import CentreApprovals from './pages/centre/Approvals';
import CentreAuditLog from './pages/centre/AuditLog';
import CentreReports from './pages/centre/Reports';
import CentreUsers from './pages/centre/Users';

// State
import StateDashboard from './pages/state/Dashboard';
import StateAgencies from './pages/state/Agencies';
import StateAgencyForm from './pages/state/AgencyForm';
import StateProjects from './pages/state/Projects';
import StateProjectCreate from './pages/state/ProjectCreate';
import StateProjectDetail from './pages/state/ProjectDetail';
import StateFunds from './pages/state/Funds';
import StateFundDisburse from './pages/state/FundDisburse';
import StateApprovals from './pages/state/Approvals';
import StateDocuments from './pages/state/Documents';
import StateReports from './pages/state/Reports';

// Agency
import AgencyDashboard from './pages/agency/Dashboard';
import AgencyProjects from './pages/agency/Projects';
import AgencyProjectDetail from './pages/agency/ProjectDetail';
import AgencyTaskUpdate from './pages/agency/TaskUpdate';
import AgencyFunds from './pages/agency/Funds';
import AgencyAddExpense from './pages/agency/AddExpense';
import AgencyDocumentUpload from './pages/agency/DocumentUpload';
import AgencyDPRSubmit from './pages/agency/DPRSubmit';
import AgencyProfile from './pages/agency/Profile';

/* ─── Route Guards ─── */
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: 'var(--surface-0)' }}>
      <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(99,102,241,0.15)', borderTopColor: 'var(--primary)' }} />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && user?.role !== allowedRole) return <Navigate to="/unauthorized" replace />;
  return <RoleLayout>{children}</RoleLayout>;
}

function getRoleHome(role) {
  switch (role) {
    case 'CENTRE': return '/centre/dashboard';
    case 'STATE': return '/state/dashboard';
    case 'AGENCY': return '/agency/dashboard';
    default: return '/login';
  }
}

function AuthRedirect() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={getRoleHome(user?.role)} replace />;
  return <Navigate to="/login" replace />;
}

function LoginRoute() {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={getRoleHome(user?.role)} replace />;
  return <Login />;
}

/* ─── Routes ─── */
function AppRoutes() {
  return (
    <Routes>
      {/* Shared */}
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ─── Centre Routes ─── */}
      <Route path="/centre/dashboard" element={<ProtectedRoute allowedRole="CENTRE"><CentreDashboard /></ProtectedRoute>} />
      <Route path="/centre/states" element={<ProtectedRoute allowedRole="CENTRE"><CentreStates /></ProtectedRoute>} />
      <Route path="/centre/agencies" element={<ProtectedRoute allowedRole="CENTRE"><CentreAgencies /></ProtectedRoute>} />
      <Route path="/centre/projects" element={<ProtectedRoute allowedRole="CENTRE"><CentreProjects /></ProtectedRoute>} />
      <Route path="/centre/projects/:id" element={<ProtectedRoute allowedRole="CENTRE"><CentreProjectDetail /></ProtectedRoute>} />
      <Route path="/centre/funds" element={<ProtectedRoute allowedRole="CENTRE"><CentreFunds /></ProtectedRoute>} />
      <Route path="/centre/funds/release" element={<ProtectedRoute allowedRole="CENTRE"><CentreFundRelease /></ProtectedRoute>} />
      <Route path="/centre/approvals" element={<ProtectedRoute allowedRole="CENTRE"><CentreApprovals /></ProtectedRoute>} />
      <Route path="/centre/audit" element={<ProtectedRoute allowedRole="CENTRE"><CentreAuditLog /></ProtectedRoute>} />
      <Route path="/centre/reports" element={<ProtectedRoute allowedRole="CENTRE"><CentreReports /></ProtectedRoute>} />
      <Route path="/centre/users" element={<ProtectedRoute allowedRole="CENTRE"><CentreUsers /></ProtectedRoute>} />
      <Route path="/centre/notifications" element={<ProtectedRoute allowedRole="CENTRE"><Notifications /></ProtectedRoute>} />

      {/* ─── State Routes ─── */}
      <Route path="/state/dashboard" element={<ProtectedRoute allowedRole="STATE"><StateDashboard /></ProtectedRoute>} />
      <Route path="/state/agencies" element={<ProtectedRoute allowedRole="STATE"><StateAgencies /></ProtectedRoute>} />
      <Route path="/state/agencies/add" element={<ProtectedRoute allowedRole="STATE"><StateAgencyForm /></ProtectedRoute>} />
      <Route path="/state/agencies/edit/:id" element={<ProtectedRoute allowedRole="STATE"><StateAgencyForm /></ProtectedRoute>} />
      <Route path="/state/projects" element={<ProtectedRoute allowedRole="STATE"><StateProjects /></ProtectedRoute>} />
      <Route path="/state/projects/create" element={<ProtectedRoute allowedRole="STATE"><StateProjectCreate /></ProtectedRoute>} />
      <Route path="/state/projects/:id" element={<ProtectedRoute allowedRole="STATE"><StateProjectDetail /></ProtectedRoute>} />
      <Route path="/state/funds" element={<ProtectedRoute allowedRole="STATE"><StateFunds /></ProtectedRoute>} />
      <Route path="/state/funds/disburse" element={<ProtectedRoute allowedRole="STATE"><StateFundDisburse /></ProtectedRoute>} />
      <Route path="/state/approvals" element={<ProtectedRoute allowedRole="STATE"><StateApprovals /></ProtectedRoute>} />
      <Route path="/state/documents" element={<ProtectedRoute allowedRole="STATE"><StateDocuments /></ProtectedRoute>} />
      <Route path="/state/reports" element={<ProtectedRoute allowedRole="STATE"><StateReports /></ProtectedRoute>} />
      <Route path="/state/notifications" element={<ProtectedRoute allowedRole="STATE"><Notifications /></ProtectedRoute>} />

      {/* ─── Agency Routes ─── */}
      <Route path="/agency/dashboard" element={<ProtectedRoute allowedRole="AGENCY"><AgencyDashboard /></ProtectedRoute>} />
      <Route path="/agency/projects" element={<ProtectedRoute allowedRole="AGENCY"><AgencyProjects /></ProtectedRoute>} />
      <Route path="/agency/projects/:id" element={<ProtectedRoute allowedRole="AGENCY"><AgencyProjectDetail /></ProtectedRoute>} />
      <Route path="/agency/tasks/update/:projectId" element={<ProtectedRoute allowedRole="AGENCY"><AgencyTaskUpdate /></ProtectedRoute>} />
      <Route path="/agency/funds" element={<ProtectedRoute allowedRole="AGENCY"><AgencyFunds /></ProtectedRoute>} />
      <Route path="/agency/funds/add-expense" element={<ProtectedRoute allowedRole="AGENCY"><AgencyAddExpense /></ProtectedRoute>} />
      <Route path="/agency/documents/upload" element={<ProtectedRoute allowedRole="AGENCY"><AgencyDocumentUpload /></ProtectedRoute>} />
      <Route path="/agency/dpr/submit" element={<ProtectedRoute allowedRole="AGENCY"><AgencyDPRSubmit /></ProtectedRoute>} />
      <Route path="/agency/notifications" element={<ProtectedRoute allowedRole="AGENCY"><Notifications /></ProtectedRoute>} />
      <Route path="/agency/profile" element={<ProtectedRoute allowedRole="AGENCY"><AgencyProfile /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="dark"
          toastStyle={{ background: '#1e293b', border: '1px solid #334155', color: '#f1f5f9' }} />
      </AuthProvider>
    </BrowserRouter>
  );
}
