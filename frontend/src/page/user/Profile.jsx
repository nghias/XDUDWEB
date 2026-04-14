import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Mail, Phone, Calendar, Edit3, Save, Loader2 } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // State để lưu thông tin khi chỉnh sửa
  const [editData, setEditData] = useState({
    ho_ten: "",
    so_dien_thoai: "",
    email: ""
  });

  const API_BASE_URL = "https://xdudweb-php.onrender.com";

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user_session"));
      if (userData && userData.id) {
        const response = await axios.get(`${API_BASE_URL}/api/chi-tiet-nguoi-dung/${userData.id}`);
        setUser(response.data);
        setEditData({
          ho_ten: response.data.ho_ten,
          so_dien_thoai: response.data.so_dien_thoai || "",
          email: response.data.email
        });
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user_session"));
      await axios.put(`${API_BASE_URL}/api/cap-nhat-nguoi-dung/${userData.id}`, editData);
      
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      fetchUserProfile(); // Tải lại dữ liệu mới
    } catch (error) {
      alert("Lỗi cập nhật: " + (error.response?.data?.message || "Không thể lưu thông tin"));
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="bg-primary p-4 text-center text-white">
              <div className="position-relative d-inline-block mb-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.ho_ten)}&background=random&size=128`} 
                  className="rounded-circle border border-4 border-white shadow"
                  alt="Avatar"
                />
              </div>
              <h3 className="fw-bold mb-0">{user?.ho_ten}</h3>
              <p className="opacity-75 mb-0">Thành viên từ 2026</p>
            </div>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold m-0">Thông tin cá nhân</h5>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-1"
                  >
                    <Edit3 size={16} /> Chỉnh sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">HỌ VÀ TÊN</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><User size={18} /></span>
                    <input 
                      type="text" 
                      className={`form-control border-0 bg-light ${!isEditing && 'text-muted'}`}
                      readOnly={!isEditing}
                      value={editData.ho_ten}
                      onChange={(e) => setEditData({...editData, ho_ten: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">EMAIL</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Mail size={18} /></span>
                    <input 
                      type="email" 
                      className="form-control border-0 bg-light text-muted"
                      readOnly
                      value={editData.email}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">SỐ ĐIỆN THOẠI</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><Phone size={18} /></span>
                    <input 
                      type="text" 
                      className={`form-control border-0 bg-light ${!isEditing && 'text-muted'}`}
                      readOnly={!isEditing}
                      placeholder="Chưa cập nhật số điện thoại"
                      value={editData.so_dien_thoai}
                      onChange={(e) => setEditData({...editData, so_dien_thoai: e.target.value})}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      disabled={updateLoading}
                      className="btn btn-primary w-100 rounded-pill fw-bold py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      {updateLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Lưu thay đổi
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-light w-100 rounded-pill fw-bold py-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Profile;