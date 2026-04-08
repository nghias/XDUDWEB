import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// GENERAL
import Login from './page/general/Login';
// BỔ SUNG 2 DÒNG IMPORT DƯỚI ĐÂY:
import Register from './page/general/Register'; 
import ForgotPassword from './page/general/ForgotPassword'; 
import ChangePassword from './page/general/ChangePassword';
import ChangePassword from './page/general/Profile';

import Header from './components/Header'; 
import Footer from './components/Footer'; 

// USER
import Home from './page/user/Home';
import Search from './page/user/Search';
import ChiTietTinDang from './page/user/ChiTietTinDang';
// ADMIN
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/Admindashboard';
import UserManagement from './components/admin/UserManagement';
import AdminPost from './components/admin/AdminPost';
import PackageAdmin from './components/admin/PackageAdmin';
import SystemStats from './components/admin/SystemStats';

// Component Layout dùng chung cho User (Có Header, Footer)
const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// Component kiểm tra quyền truy cập (Bảo vệ Route)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const session = localStorage.getItem('user_session');
  
  // Chưa đăng nhập thì đá về trang đăng nhập
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const userData = JSON.parse(session);
  
  // Đã đăng nhập nhưng không có quyền truy cập route này
  if (allowedRoles && !allowedRoles.includes(userData.vai_tro)) {
    if (userData.vai_tro === 'quan_tri') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />; 
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* --- NHÓM 1: KHÔNG CÓ LAYOUT (Không có Header/Footer) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
            path="/change-password" 
            element={
                <ProtectedRoute allowedRoles={['nguoi_tim_phong', 'chu_nha', 'quan_tri']}>
                    <ChangePassword />
                </ProtectedRoute>
            } 
        />
        <Route path="/profile" element={<Profile />} />

        {/* --- NHÓM 2: PUBLIC CÓ LAYOUT (Được bọc bởi Header/Footer) --- */}
        <Route element={<MainLayout />}>
          <Route path="/search" element={<Search />} /> 
          <Route path="/" element={<Home />} />
          <Route path="/chi-tiet-tin-dang/:id" element={<ChiTietTinDang />} />
          <Route path="/user" element={<Navigate to="/" replace />} />
        </Route>

        {/* --- NHÓM 3: ADMIN --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['quan_tri']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="posts" element={<AdminPost />} />
          <Route path="packages" element={<PackageAdmin />} />
          <Route path="stats" element={<SystemStats />} />
        </Route>

        {/* --- NOT FOUND --- */}
        <Route path="*" element={<h1 className="text-center mt-5">404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;