import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useContext } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero.jsx";
import Features from "./pages/Features.jsx";
import Vehicle from "./pages/Vehicle.jsx";
import Fine from "./pages/Fine.jsx";
import Toll from "./pages/Toll.jsx";
import Transaction from "./pages/Transaction.jsx";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LearnMore from "./pages/LearnMore";
import Analytics from "./pages/Analytics.jsx";
import Contact from "./pages/Contact.jsx";
import AdminDashboard from "./pages/AdminDashBoard.jsx";

import { AuthProvider } from "./context/AuthProvider";
import { AuthContext } from "./context/AuthContext";

// ✅ AdminRoute wrapper for admin-only pages
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user && user.role === "admin" ? children : <Navigate to="/login" replace />;
}

// ✅ PrivateRoute wrapper for protected pages
function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
}

// ✅ Layout for user pages
function Layout({ children }) {
  const location = useLocation();

  const hideNavbar = ["/login", "/register"].includes(location.pathname);
  const hideFooter = ["/login", "/register", "/"].includes(location.pathname);
  const isHero = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className={isHero ? "" : "p-4"}>{children}</div>
      {!hideFooter && <Footer />}
    </>
  );
}

// ✅ Main AppRoutes
function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* ---------- Admin Pages (❌ no Layout) ---------- */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ---------- User Pages (✅ with Layout) ---------- */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <Layout><Hero /></Layout>}
      />
      <Route path="/features" element={<Layout><Features /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* Feature subpages (protected) */}
      <Route
        path="/features/vehicles"
        element={
          <PrivateRoute>
            <Layout><Vehicle /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/features/fines"
        element={
          <PrivateRoute>
            <Layout><Fine /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/features/toll"
        element={
          <PrivateRoute>
            <Layout><Toll /></Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/features/transactions"
        element={
          <PrivateRoute>
            <Layout><Transaction /></Layout>
          </PrivateRoute>
        }
      />

      {/* Protected user dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout><Dashboard /></Layout>
          </PrivateRoute>
        }
      />
      <Route path="/analytics" element={<Layout><Analytics /></Layout>} />

      {/* Public pages */}
      <Route path="/LearnMore" element={<Layout><LearnMore /></Layout>} />

      {/* Auth pages (❌ no Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ✅ Wrap App with AuthProvider & Router
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
