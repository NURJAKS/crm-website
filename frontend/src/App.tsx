import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import HowItWorks from './pages/HowItWorks';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import RequestDetail from './pages/RequestDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export { API_BASE };

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Публичные страницы */}
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<Blog />} />
          <Route path="login" element={<Login />} />
          
          {/* Защищённые страницы */}
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="requests"
            element={
              <PrivateRoute>
                <Requests />
              </PrivateRoute>
            }
          />
          <Route
            path="requests/:id"
            element={
              <PrivateRoute>
                <RequestDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

