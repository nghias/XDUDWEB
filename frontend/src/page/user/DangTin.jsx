import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const DangTin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [loading, setLoading] = useState(false);

  // xử lí ảnh
  const [selectedImages, setSelectedImages] = useState([]); // Mảng chứa các file thực tế
  const [previews, setPreviews] = useState([]); // Mảng chứa link để hiện ảnh lên màn hình
  const handleFileChange = (e) => {
  const files = Array.from(e.target.files);
  setSelectedImages(files);
  // Tạo đường dẫn tạm thời để check trước
  const filePreviews = files.map(file => URL.createObjectURL(file));
  setPreviews(filePreviews);
};

  // State quản lý form
  const [formData, setFormData] = useState({
    tieu_de: "",
    mo_ta: "",
    gia_thue: "",             
    dien_tich: "",
    loai_phong_id: "1",  // Giá trị mặc định
    vi_tri_id: "1",      // Giá trị mặc định
  });

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này!");
      navigate("/login");
    }
  }, [navigate]);
useEffect(() => {
    if (editData) {
      setFormData({
        tieu_de: editData.tieu_de || "",
        mo_ta: editData.mo_ta || "",
        gia_thue: editData.gia_thue || "",
        dien_tich: editData.dien_tich || "",
        loai_phong_id: String(editData.ma_loai_phong || "1"),
        vi_tri_id: String(editData.ma_vi_tri || "1"),
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

    
    const dataToSend = {
      tieu_de: String(formData.tieu_de),
      mo_ta: String(formData.mo_ta),
      gia_thue: parseFloat(formData.gia_thue),       
      dien_tich: parseFloat(formData.dien_tich), 
      ma_chu_nha: parseInt(userData?.id),       
      ma_loai_phong: parseInt(formData.loai_phong_id), 
      ma_vi_tri: parseInt(formData.vi_tri_id) 
    };

   try {
      // 1. Xác định URL và Method dựa trên việc sửa hay đăng mới
      const url = editData 
        ? `https://xdudweb-php.onrender.com/api/cap-nhat-tin-dang/${editData.id}` 
        : "https://xdudweb-php.onrender.com/api/tao-tin-dang";
      
      const method = editData ? "put" : "post"; // Sửa thì dùng PUT, mới thì dùng POST

      const response = await axios({
        method: method,
        url: url,
        data: dataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // 2. Thông báo khớp với hành động
      const successMsg = editData 
        ? "Cập nhật tin đăng thành công!" 
        : "Chúc mừng bạn! Đăng tin thành công.";
      
      alert(successMsg);
      
      // 3. Điều hướng về trang danh sách tin của người dùng để xem kết quả
      navigate("/my-posts"); 

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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="bg-primary p-4 text-white">
              <h3 className="mb-0 fw-bold">Đăng tin cho thuê mới</h3>
              <p className="small mb-0 opacity-75">Vui lòng nhập đầy đủ thông tin để tin đăng được duyệt nhanh hơn</p>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Tiêu đề tin</label>
                  <input type="text" name="tieu_de" className="form-control form-control-lg rounded-3" value={formData.tieu_de}
                    placeholder="VD: Phòng trọ giá rẻ gần STU..." required onChange={handleChange} />
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Giá thuê (VNĐ)</label>
                    <input type="number" name="gia_thue" className="form-control rounded-3" value={formData.gia_thue}
                      placeholder="VD: 3500000" required onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Diện tích (m²)</label>
                    <input type="number" name="dien_tich" className="form-control rounded-3"  value={formData.dien_tich}
                      placeholder="VD: 25" required onChange={handleChange} />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Mô tả chi tiết</label>
                  <textarea name="mo_ta" className="form-control rounded-3" rows="4" value={formData.mo_ta}
                    placeholder="Mô tả về tiện ích, điện nước, nội thất..." required onChange={handleChange}></textarea>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold" >Loại phòng</label>
                    <select name="loai_phong_id" className="form-select rounded-3" value={formData.loai_phong_id} onChange={handleChange}>
                      <option value="1">Phòng trọ</option>
                      <option value="2">Căn hộ</option>
                      <option value="3">Studio</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Khu vực</label>
                    <select name="vi_tri_id" className="form-select rounded-3 "value={formData.vi_tri_id} onChange={handleChange}>
                      <option value="1">Quận 8</option>
                      <option value="2">Quận 7</option>
                      <option value="3">Quận 1</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Đang xử lý...</>
                  ) : (
                    <><Send size={18} /> Đăng tin ngay</>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-light rounded-3 border d-flex gap-2">
            <AlertCircle className="text-warning" size={20} />
            <small className="text-muted">
              Lưu ý: Bạn phải chọn đúng <strong>Loại phòng</strong> và <strong>Khu vực</strong> hiện có trong hệ thống để tránh lỗi dữ liệu.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangTin;