import React, { useState, useEffect } from "react";
import axios from "axios";

// === TẠO DỮ LIỆU GIẢ (MOCK DATA) ===
// Dữ liệu này mô phỏng cấu trúc trả về từ Backend
const mockUsersData = [
  { user_id: 1, full_name: "Nguyễn Văn Admin", email: "admin@gmail.com", phone: "0901234567", role: "admin", is_blocked: false, created_at: "2023-10-01T10:00:00Z" },
  { user_id: 2, full_name: "Trần Thị Chủ Trọ", email: "chutro@gmail.com", phone: "0912345678", role: "landlord", is_blocked: false, created_at: "2023-11-15T14:30:00Z" },
  { user_id: 3, full_name: "Lê Văn Khách Thuê", email: "khachthue@gmail.com", phone: "0923456789", role: "renter", is_blocked: false, created_at: "2024-01-20T08:15:00Z" },
  { user_id: 4, full_name: "Phạm Thị Khách Bị Khóa", email: "baduser@gmail.com", phone: "0934567890", role: "renter", is_blocked: true, created_at: "2024-02-10T16:45:00Z" },
];

const UserManagement = () => {
  // === STATE ===
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Hàm hiển thị thông báo (thay thế cho toast gốc)
  const toast = (msg) => {
    alert(msg);
  };

  // === FETCH API ===
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // 🛑 TẠM ẨN GỌI API THẬT KHI CHƯA CÓ BACKEND:
      // const res = await axios.get("/admin/users");
      // setUsers(res.data || []);

      // ✅ DÙNG MOCK DATA: Giả lập delay 1 giây để test UI Loading
      setTimeout(() => {
        setUsers(mockUsersData);
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error("API error:", err.response?.data || err);
      toast("Lỗi tải danh sách người dùng!");
      setLoading(false); // Đảm bảo luôn tắt loading dù có lỗi
    }
  };

  // === ACTIONS ===
  const toggleBlockUser = async (user) => {
    if (user.role === "admin") {
      toast("Không thể khóa tài khoản Admin!");
      return;
    }

    setLoadingId(user.user_id);
    try {
      // 🛑 TẠM ẨN GỌI API THẬT:
      // await axios.patch(`/admin/users/${user.user_id}/block`, {
      //   is_blocked: !user.is_blocked,
      // });

      // ✅ GIẢ LẬP CALL API THÀNH CÔNG (Delay 0.5s):
      setTimeout(() => {
        // React: Tạo mảng mới với thông tin user đã được cập nhật
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.user_id === user.user_id ? { ...u, is_blocked: !u.is_blocked } : u
          )
        );

        toast(
          !user.is_blocked
            ? `Đã khóa tài khoản ${user.full_name}`
            : `Đã mở khóa tài khoản ${user.full_name}`
        );
        setLoadingId(null);
      }, 500);

    } catch (err) {
      console.error("Block error:", err?.response?.data || err);
      toast("Thao tác thất bại!");
      setLoadingId(null);
    }
  };

  // === COMPUTED (Derived State) ===
  // Bọc lớp an toàn: Đảm bảo users luôn là mảng để tránh lỗi "users.filter is not a function"
  const safeUsers = Array.isArray(users) ? users : [];
  
  const filteredUsers = safeUsers.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  // === FORMATTERS ===
  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "admin": return "bg-success";
      case "landlord": return "bg-info";
      case "renter": return "bg-secondary";
      default: return "bg-secondary";
    }
  };

  // === LIFECYCLE ===
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 user-management-container">
      {/* CSS Nhúng Trực Tiếp */}
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
            
            {/* Chỉ hiện nội dung bảng khi có dữ liệu và không loading */}
            {!loading && filteredUsers.length > 0 && (
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td>{user.user_id}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div
                          className="avatar me-3 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {user.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <strong>{user.full_name || "Chưa đặt tên"}</strong>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.phone || "Chưa có"}</td>
                    <td>
                      <span className={`badge ${getRoleClass(user.role)}`}>
                        {user.role ? user.role.toUpperCase() : "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${user.is_blocked ? "bg-danger" : "bg-success"}`}>
                        {user.is_blocked ? "Bị khóa" : "Hoạt động"}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td className="text-center">
                      <button
                        onClick={() => toggleBlockUser(user)}
                        className={`btn btn-sm ${user.is_blocked ? "btn-success" : "btn-warning"}`}
                        disabled={loadingId === user.user_id}
                      >
                        {loadingId === user.user_id ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <>
                            <i className={`bi me-1 ${user.is_blocked ? "bi-unlock" : "bi-lock"}`}></i>
                            {user.is_blocked ? "Mở khóa" : "Khóa"}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
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