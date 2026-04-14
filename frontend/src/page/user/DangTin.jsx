import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Send, AlertCircle } from "lucide-react";

const DangTin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData; // Bắt dữ liệu nếu được điều hướng từ nút Sửa
  const [loading, setLoading] = useState(false);

  // State quản lý form
  const [formData, setFormData] = useState({
    tieu_de: "",
    mo_ta: "",
    gia_thue: "",             
    dien_tich: "",
    loai_phong_id: "1",
    vi_tri_id: "1",
    trang_thai: "hoat_dong" // Bổ sung trường trạng thái
  });

  // Check đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này!");
      navigate("/login");
    }
  }, [navigate]);

  // Nạp dữ liệu vào form nếu đang ở chế độ SỬA (editData tồn tại)
  useEffect(() => {
    if (editData) {
      setFormData({
        tieu_de: editData.tieu_de || "",
        mo_ta: editData.mo_ta || "",
        gia_thue: editData.gia_thue || "",
        dien_tich: editData.dien_tich || "",
        loai_phong_id: String(editData.ma_loai_phong || "1"),
        vi_tri_id: String(editData.ma_vi_tri || "1"),
        trang_thai: editData.trang_thai || "hoat_dong"
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("auth_token");
    const userData = JSON.parse(localStorage.getItem("user_session"));
    
    // Payload chuẩn bị gửi
    const dataToSend = {
      tieu_de: String(formData.tieu_de),
      mo_ta: String(formData.mo_ta),
      gia: parseFloat(formData.gia_thue), // Đổi tên thành "gia" để khớp với Backend
      dien_tich: parseFloat(formData.dien_tich), 
      nguoi_dung_id: parseInt(userData?.id), // Sửa tên biến để khớp DB 
      loai_phong_id: parseInt(formData.loai_phong_id), 
      vi_tri_id: parseInt(formData.vi_tri_id),
      trang_thai: formData.trang_thai
    };

    try {
      const url = editData 
        ? `https://xdudweb-php.onrender.com/api/cap-nhat-tin-dang/${editData.id}` 
        : "https://xdudweb-php.onrender.com/api/tao-tin-dang";
      
      const method = editData ? "put" : "post";

      await axios({
        method: method,
        url: url,
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const successMsg = editData ? "Cập nhật tin đăng thành công!" : "Chúc mừng bạn! Đăng tin thành công.";
      alert(successMsg);
      
      // Chuyển hướng về lại trang danh sách quản lý
      navigate("/quan-ly-tin-dang"); 

    } catch (error) {
      console.error("Lỗi xử lý tin:", error.response?.data);
      const serverErrors = error.response?.data?.errors;
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors).flat().join("\n");
        alert("Dữ liệu không hợp lệ:\n" + errorMessages);
      } else {
        alert("Lỗi: " + (error.response?.data?.message || "Không thể kết nối đến server"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 min-vh-100 bg-light">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          {/* Nút Quay Lại */}
          <button onClick={() => navigate('/quan-ly-tin-dang')} className="btn btn-link text-decoration-none mb-3 px-0 text-secondary fw-medium">
            <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
          </button>

          <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="bg-primary p-4 text-white">
              <h3 className="mb-1 fw-bold">{editData ? "Cập nhật tin đăng" : "Đăng tin cho thuê mới"}</h3>
              <p className="small mb-0 opacity-75">Vui lòng nhập đầy đủ thông tin để tin đăng được duyệt nhanh hơn</p>
            </div>

            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Tiêu đề tin</label>
                  <input type="text" name="tieu_de" className="form-control form-control-lg rounded-3" value={formData.tieu_de}
                    placeholder="VD: Phòng trọ giá rẻ gần STU..." required onChange={handleChange} />
                </div>

                <div className="row mb-4 g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Giá thuê (VNĐ)</label>
                    <input type="number" name="gia_thue" className="form-control py-2 rounded-3" value={formData.gia_thue}
                      placeholder="VD: 3500000" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Diện tích (m²)</label>
                    <input type="number" name="dien_tich" className="form-control py-2 rounded-3" value={formData.dien_tich}
                      placeholder="VD: 25" required onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Mô tả chi tiết</label>
                  <textarea name="mo_ta" className="form-control rounded-3" rows="5" value={formData.mo_ta}
                    placeholder="Mô tả về tiện ích, điện nước, nội thất..." required onChange={handleChange}></textarea>
                </div>

                <div className="row mb-4 g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold" >Loại phòng</label>
                    <select name="loai_phong_id" className="form-select py-2 rounded-3" value={formData.loai_phong_id} onChange={handleChange}>
                      <option value="1">Phòng trọ</option>
                      <option value="2">Căn hộ dịch vụ</option>
                      <option value="3">Nhà nguyên căn</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Khu vực</label>
                    <select name="vi_tri_id" className="form-select py-2 rounded-3" value={formData.vi_tri_id} onChange={handleChange}>
                      <option value="1">Quận 1</option>
                      <option value="2">Quận 2</option>
                      <option value="8">Quận 8</option>
                    </select>
                  </div>
                </div>

                {/* Nếu đang sửa thì mới cho phép đổi Trạng thái */}
                {editData && (
                  <div className="mb-5">
                    <label className="form-label fw-bold">Trạng thái tin</label>
                    <select name="trang_thai" className="form-select py-2 rounded-3" value={formData.trang_thai} onChange={handleChange}>
                      <option value="hoat_dong">Đang hoạt động</option>
                      <option value="cho_duyet">Chờ duyệt</option>
                      <option value="da_cho_thue">Đã cho thuê</option>
                    </select>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold fs-5 mt-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Đang xử lý...</>
                  ) : (
                    <><Send size={20} /> {editData ? "Lưu thay đổi" : "Đăng tin ngay"}</>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-3 border d-flex align-items-center gap-3 shadow-sm">
            <AlertCircle className="text-warning flex-shrink-0" size={24} />
            <small className="text-muted" style={{ lineHeight: '1.6' }}>
              Lưu ý: Bạn phải chọn đúng <strong>Loại phòng</strong> và <strong>Khu vực</strong> hiện có trong hệ thống để tránh lỗi dữ liệu. Hệ thống sẽ kiểm duyệt nội dung trước khi hiển thị công khai.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangTin;