import React, { useState, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";


const AdminLayout = () => {
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState("Admin Panel");

  // --- Refs cho Bootstrap Modals ---
  // Trong React, chúng ta dùng useRef thay vì document.getElementById
  const packageModalRef = useRef(null);
  const userModalRef = useRef(null);

  // --- Logic User (Tương tự Vue) ---
  const [newUser, setNewUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "renter",
  });
  const [creating, setCreating] = useState(false);

  const openCreateUserModal = () => {
    // Đảm bảo window.bootstrap đã được load từ CDN hoặc import
    if (window.bootstrap && userModalRef.current) {
      const modal = new window.bootstrap.Modal(userModalRef.current);
      modal.show();
    }
  };

  // --- [MỚI] Logic Package ---
  const initialPackageState = {
    package_name: "",
    price: 0,
    duration_days: 30,
    max_posts: 1,
    is_highlight: false,
    description: "",
  };
  const [newPackage, setNewPackage] = useState(initialPackageState);
  const [creatingPackage, setCreatingPackage] = useState(false);

  const openCreatePackageModal = () => {
    setNewPackage(initialPackageState); // Reset form
    if (window.bootstrap && packageModalRef.current) {
      const modal = new window.bootstrap.Modal(packageModalRef.current);
      modal.show();
    }
  };

  const submitCreatePackage = async (e) => {
    if (e) e.preventDefault(); // Thay thế cho @submit.prevent
    setCreatingPackage(true);

    try {
      const payload = {
        ...newPackage,
        is_highlight: newPackage.is_highlight ? 1 : 0,
      };

      await axios.post("/admin/packages", payload);
      alert("Thêm gói dịch vụ thành công!");

      // Đóng modal bằng React Ref
      if (window.bootstrap && packageModalRef.current) {
        const modalInstance = window.bootstrap.Modal.getInstance(packageModalRef.current);
        if (modalInstance) modalInstance.hide();
      }

    } catch (err) {
      alert(err.response?.data?.message || "Lỗi thêm gói dịch vụ. Vui lòng thử lại!");
    } finally {
      setCreatingPackage(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login"); // Thay thế cho this.router.push
  };

  // Hàm hỗ trợ style cho NavLink (Thay thế active-class của Vue)
  const navLinkClass = ({ isActive }) =>
    isActive
      ? "nav-link rounded px-3 py-2 d-flex align-items-center bg-white text-danger fw-bold"
      : "nav-link text-white rounded px-3 py-2 d-flex align-items-center transition-all";

  return (
    <div className="d-flex min-vh-100 bg-gray-100">
      {/* Sidebar */}
     {/* Code mới đã sửa */}
<div className="bg-danger text-white d-flex flex-column flex-shrink-0" style={{ width: "280px", minHeight: "100vh" }}>
        <div className="p-4 text-center border-bottom border-light">
          <h3 className="mb-0 fw-bold">ADMIN THUETRO.VN</h3>
          
        </div>
        <nav className="flex-grow-1 p-3">
          <ul className="nav flex-column gap-2">
            <li>
              <NavLink to="/admin/users" className={navLinkClass}>
                <i className="bi bi-people me-2"></i> Quản lý người dùng
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/posts" className={navLinkClass}>
                <i className="bi bi-house-door me-2"></i> Quản lý tin đăng
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/packages" className={navLinkClass}>
                <i className="bi bi-box-seam me-2"></i> Quản lý gói dịch vụ
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/stats" className={navLinkClass}>
                <i className="bi bi-graph-up me-2"></i> Thống kê
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Topbar */}
        <div className="bg-white shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0 fw-bold">{pageTitle}</h2>
            <div className="d-flex gap-2">
              <button
                onClick={openCreateUserModal}
                className="btn btn-success btn-lg shadow-sm d-flex align-items-center"
              >
                <i className="bi bi-person-plus-fill me-2"></i> Tạo tài khoản
              </button>

              <button
                onClick={openCreatePackageModal}
                className="btn btn-warning text-white btn-lg shadow-sm d-flex align-items-center"
              >
                <i className="bi bi-plus-circle-fill me-2"></i> Thêm gói dịch vụ
              </button>
              
              {/* Nút Đăng xuất (Tùy chọn, tôi gọi hàm logout ở đây) */}
              <button onClick={logout} className="btn btn-outline-danger btn-lg shadow-sm d-flex align-items-center">
                 <i className="bi bi-box-arrow-right me-2"></i> Thoát
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Pages Render Here */}
        <div className="container-fluid px-4 pb-5 flex-grow-1">
          <Outlet /> {/* Tương đương <router-view /> */}
        </div>
      </div>

      {/* Modal Thêm Gói Dịch Vụ */}
      <div
        className="modal fade"
        id="createPackageModal"
        tabIndex="-1"
        aria-hidden="true"
        ref={packageModalRef} // Gắn ref vào đây để JS thao tác
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">
                <i className="bi bi-box-seam me-2"></i> Thêm gói dịch vụ mới
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={submitCreatePackage}>
                <div className="row g-3">
                  {/* Tên gói */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tên gói <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="VD: Gói VIP 1"
                      value={newPackage.package_name}
                      onChange={(e) => setNewPackage({ ...newPackage, package_name: e.target.value })}
                    />
                  </div>

                  {/* Giá */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Giá (VNĐ) <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      step="1000"
                      className="form-control"
                      required
                      placeholder="VD: 50000"
                      value={newPackage.price}
                      onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                    />
                  </div>

                  {/* Thời hạn */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Thời hạn (Ngày)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="VD: 30"
                      value={newPackage.duration_days}
                      onChange={(e) => setNewPackage({ ...newPackage, duration_days: Number(e.target.value) })}
                    />
                  </div>

                  {/* Số tin tối đa */}
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Số tin tối đa</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newPackage.max_posts}
                      onChange={(e) => setNewPackage({ ...newPackage, max_posts: Number(e.target.value) })}
                    />
                  </div>

                  {/* Checkbox Gói nổi bật */}
                  <div className="col-md-4 d-flex align-items-end">
                    <div className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isHighlightCheck"
                        checked={newPackage.is_highlight}
                        onChange={(e) => setNewPackage({ ...newPackage, is_highlight: e.target.checked })}
                      />
                      <label className="form-check-label fw-bold" htmlFor="isHighlightCheck">
                        Là gói nổi bật?
                      </label>
                    </div>
                  </div>

                  {/* Mô tả */}
                  <div className="col-12">
                    <label className="form-label fw-bold">Mô tả gói</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Nhập mô tả chi tiết về quyền lợi..."
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Hủy
              </button>
              <button onClick={submitCreatePackage} className="btn btn-warning text-white" disabled={creatingPackage}>
                {creatingPackage && <span className="spinner-border spinner-border-sm me-2"></span>}
                Lưu gói dịch vụ
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Nơi đặt createUserModal nếu bạn có... */}
      <div id="createUserModal" ref={userModalRef}></div>

    </div>
  );
};

export default AdminLayout;