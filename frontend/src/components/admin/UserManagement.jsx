import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  // === STATE ===
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toast = (msg) => {
    alert(msg);
  };

  // === CẤU HÌNH API & TOKEN ===
  const API_URL = "https://xdudweb-php.onrender.com/api/admin/users"; 

  // Hàm đính kèm Token bảo mật cho mỗi request
  const getAxiosConfig = () => {
    // Lưu ý: Thay "access_token" bằng đúng tên key lưu token của bạn dưới LocalStorage
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    };
  };

  // === FETCH API (LẤY DANH SÁCH) ===
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAxiosConfig());
      const data = res.data?.data || res.data || [];
      setUsers(data);
    } catch (err) {
      console.error("API error:", err.response?.data || err);
      toast("Lỗi tải danh sách người dùng! Kiểm tra lại đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  // === ACTIONS: KHÓA / MỞ KHÓA ===
  const toggleBlockUser = async (user) => {
    if (user.vai_tro === "admin") {
      toast("Không thể khóa tài khoản Admin!");
      return;
    }

    setLoadingId(user.id);
    try {
      const res = await axios.post(`${API_URL}/${user.id}/toggle-status`, {}, getAxiosConfig());
      
      // Lấy trạng thái mới từ API, nếu không có thì tự đảo ngược local
      const newStatus = res.data.new_status || (user.trang_thai === 'hoat_dong' ? 'khoa' : 'hoat_dong');

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, trang_thai: newStatus } : u
        )
      );

      toast(
        newStatus === 'khoa'
          ? `Đã khóa tài khoản ${user.ho_ten}`
          : `Đã mở khóa tài khoản ${user.ho_ten}`
      );
    } catch (err) {
      console.error("Toggle status error:", err?.response?.data || err);
      toast("Thao tác thất bại! Yêu cầu quyền truy cập.");
    } finally {
      setLoadingId(null);
    }
  };

  // === ACTIONS: XÓA NGƯỜI DÙNG ===
  const deleteUser = async (user) => {
    if (user.vai_tro === "admin") {
      toast("Không thể xóa tài khoản Admin!");
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${user.ho_ten} không?`)) {
      return;
    }

    setLoadingId(`delete-${user.id}`);
    try {
      await axios.delete(`${API_URL}/${user.id}`, getAxiosConfig());
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
      toast(`Đã xóa tài khoản ${user.ho_ten}`);
    } catch (err) {
      console.error("Delete error:", err?.response?.data || err);
      toast("Xóa thất bại!");
    } finally {
      setLoadingId(null);
    }
  };

  // === COMPUTED (Derived State) ===
  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.ho_ten?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.so_dien_thoai?.includes(q)
    );
  });

  // === FORMATTERS ===
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("vi-VN");
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "admin": return "bg-success";
      case "chu_tro": case "landlord": return "bg-info";
      case "nguoi_thue": case "renter": return "bg-secondary";
      default: return "bg-secondary";
    }
  };

  // === LIFECYCLE ===
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 user-management-container">
      <style>
        {`
          .user-management-container .avatar {
            font-weight: bold;
            font-size: 1.1rem;
          }
          .user-management-container .badge {
            font-size: 0.85rem;
          }
        `}
      </style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Quản lý người dùng</h3>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, email, sđt..."
            className="form-control form-control-sm d-inline-block w-auto me-2"
          />
          <button onClick={fetchUsers} className="btn btn-primary btn-sm">
            <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
          </button>
        </div>
      </div>

      {/* Bảng người dùng */}
      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            
            {!loading && filteredUsers.length > 0 && (
              <tbody>
                {filteredUsers.map((user) => {
                  const isBlocked = user.trang_thai === 'khoa';

                  return (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="avatar me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {user.ho_ten?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <strong>{user.ho_ten || "Chưa đặt tên"}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.so_dien_thoai || "Chưa có"}</td>
                      <td>
                        <span className={`badge ${getRoleClass(user.vai_tro)}`}>
                          {user.vai_tro ? user.vai_tro.toUpperCase() : "N/A"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isBlocked ? "bg-danger" : "bg-success"}`}>
                          {isBlocked ? "Bị khóa" : "Hoạt động"}
                        </span>
                      </td>
                      <td>{formatDate(user.ngay_tao)}</td>
                      <td className="text-center">
                        <div className="btn-group">
                          {/* Nút Khóa/Mở Khóa */}
                          <button
                            onClick={() => toggleBlockUser(user)}
                            className={`btn btn-sm ${isBlocked ? "btn-success" : "btn-warning"}`}
                            disabled={loadingId === user.id || loadingId === `delete-${user.id}`}
                          >
                            {loadingId === user.id ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <>
                                <i className={`bi me-1 ${isBlocked ? "bi-unlock" : "bi-lock"}`}></i>
                                {isBlocked ? "Mở khóa" : "Khóa"}
                              </>
                            )}
                          </button>
                          
                          {/* Nút Xóa */}
                          <button
                            onClick={() => deleteUser(user)}
                            className="btn btn-sm btn-danger ms-1"
                            disabled={loadingId === user.id || loadingId === `delete-${user.id}`}
                          >
                            {loadingId === `delete-${user.id}` ? (
                              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                              <>
                                <i className="bi bi-trash me-1"></i> Xóa
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* Trạng thái Loading */}
        {loading && (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">Đang tải danh sách người dùng...</p>
          </div>
        )}

        {/* Trạng thái Trống (Empty State) */}
        {!loading && safeUsers.length === 0 && (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-people fs-1"></i>
            <p>Chưa có người dùng nào</p>
          </div>
        )}
        
        {/* Báo lỗi nếu tìm kiếm không ra kết quả */}
        {!loading && safeUsers.length > 0 && filteredUsers.length === 0 && (
          <div className="p-4 text-center text-muted">
            <p>Không tìm thấy kết quả nào phù hợp với "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;