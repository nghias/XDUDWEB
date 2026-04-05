import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// GENERAL
import Login from './page/general/Login';
import Header from './components/Header'; // Hãy sửa lại đường dẫn này cho đúng với thư mục của bạn
import Footer from './components/Footer'; // Hãy sửa lại đường dẫn này cho đúng với thư mục của bạn

// USER
import Home from './page/user/Home';

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
      {/* Thẻ Outlet sẽ render các component con (như Home) nằm bên trong Route MainLayout */}
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
    // Tự động điều hướng về đúng không gian làm việc của role đó
    if (userData.vai_tro === 'quan_tri') return <Navigate to="/admin" replace />;
    return <Navigate to="/user" replace />; 
  }

  // Hợp lệ thì cho phép render component con
  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* --- NHÓM 1: KHÔNG CÓ LAYOUT (Không có Header/Footer) --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* --- NHÓM 2: USER CÓ LAYOUT (Được bọc bởi Header/Footer) --- */}
        <Route element={<MainLayout />}>
          <Route 
            path="/user" 
            element={
              // Cho phép người tìm phòng và chủ nhà truy cập /user
              <ProtectedRoute allowedRoles={['nguoi_tim_phong', 'chu_nha']}>
                <Home />
              </ProtectedRoute>
            } 
          />
          {/* Sau này bạn có thêm trang Thông tin cá nhân, Đổi mật khẩu... thì viết tiếp vào đây */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>

        {/* --- NHÓM 3: ADMIN --- */}
        {/* Admin thường có Layout riêng (AdminLayout đã import) nên để ngoài MainLayout */}
        <Route 
          path="/admin" 
          element={
            // Chỉ cho phép admin truy cập cụm route này
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
        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;