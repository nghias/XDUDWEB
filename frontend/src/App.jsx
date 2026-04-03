import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
// USER
import Home from './pages/user/Home';

// ADMIN
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/Admindashboard';
import UserManagement from './components/admin/UserManagement';
import AdminPost from './components/admin/AdminPost';
import PackageAdmin from './components/admin/PackageAdmin';
import SystemStats from './components/admin/SystemStats';

function App() {
  return (
    <Router>
      <Routes>

        {/* USER */}
        <Route path="/" element={<Navigate to="/user" />} />
        <Route path="/user" element={<Home />} />

        {/* ADMIN */}
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="posts" element={<AdminPost />} />
          <Route path="packages" element={<PackageAdmin />} />
          <Route path="stats" element={<SystemStats />} />
        </Route>

        {/* NOT FOUND */}
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;