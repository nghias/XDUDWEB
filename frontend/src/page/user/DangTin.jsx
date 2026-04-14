import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Send, AlertCircle, ImagePlus, X } from "lucide-react";

const DangTin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [loading, setLoading] = useState(false);

  // State Quản lý File Hình Ảnh
  const [selectedImages, setSelectedImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]); // Giải phóng bộ nhớ
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // State quản lý Tiện ích (Mảng các ID tiện ích được check)
  const [selectedTienIch, setSelectedTienIch] = useState([]);

  const handleTienIchChange = (id) => {
    if (selectedTienIch.includes(id)) {
      setSelectedTienIch(selectedTienIch.filter(item => item !== id));
    } else {
      setSelectedTienIch([...selectedTienIch, id]);
    }
  };

  // State quản lý form văn bản
  const [formData, setFormData] = useState({
    tieu_de: "",
    mo_ta: "",
    gia_thue: "",             
    dien_tich: "",
    ma_loai_phong: "1",
    trang_thai: "hoat_dong",
    // Các trường vị trí mới
    tinh_thanh_pho: "Hồ Chí Minh",
    quan_huyen: "Quận 1",
    phuong_xa: "",
    ten_duong: "",
    dia_chi_chi_tiet: ""
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
        ma_loai_phong: String(editData.ma_loai_phong || "1"),
        trang_thai: editData.trang_thai || "hoat_dong",
        tinh_thanh_pho: editData.vi_tri?.tinh_thanh_pho || "Hồ Chí Minh",
        quan_huyen: editData.vi_tri?.quan_huyen || "Quận 1",
        phuong_xa: editData.vi_tri?.phuong_xa || "",
        ten_duong: editData.vi_tri?.ten_duong || "",
        dia_chi_chi_tiet: editData.vi_tri?.dia_chi_chi_tiet || "",
      });
      // Nếu có API trả về mảng ID tiện ích của tin này, có thể set vào setSelectedTienIch ở đây
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
    
    // VÌ CÓ FILE ẢNH, PHẢI DÙNG FORMDATA THAY VÌ JSON
    const dataToSend = new FormData();
    dataToSend.append('tieu_de', formData.tieu_de);
    dataToSend.append('mo_ta', formData.mo_ta);
    dataToSend.append('gia_thue', formData.gia_thue);
    dataToSend.append('dien_tich', formData.dien_tich);
    dataToSend.append('ma_chu_nha', userData?.id);
    dataToSend.append('ma_loai_phong', formData.ma_loai_phong);
    dataToSend.append('trang_thai', formData.trang_thai);
    
    // Nạp Vị trí
    dataToSend.append('tinh_thanh_pho', formData.tinh_thanh_pho);
    dataToSend.append('quan_huyen', formData.quan_huyen);
    dataToSend.append('phuong_xa', formData.phuong_xa);
    dataToSend.append('ten_duong', formData.ten_duong);
    dataToSend.append('dia_chi_chi_tiet', formData.dia_chi_chi_tiet);

    // Nạp mảng Tiện Ích
    selectedTienIch.forEach((id) => {
        dataToSend.append('tien_ich[]', id);
    });

    // Nạp Hình Ảnh
    selectedImages.forEach((file) => {
        dataToSend.append('hinh_anh[]', file);
    });

    // Mẹo cho Laravel: Nếu đang sửa (PUT) mà gửi FormData, phải gửi dạng POST kèm _method
    if (editData) {
        dataToSend.append('_method', 'PUT');
    }

    try {
      const url = editData 
        ? `https://xdudweb-php.onrender.com/api/cap-nhat-tin-dang/${editData.id}` 
        : "https://xdudweb-php.onrender.com/api/tao-tin-dang";

      // Gửi dưới dạng POST bất kể tạo hay sửa vì FormData cần POST
      await axios.post(url, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Header đặc biệt cho file
          Accept: "application/json",
        },
      });

      const successMsg = editData ? "Cập nhật tin đăng thành công!" : "Chúc mừng bạn! Đăng tin thành công.";
      alert(successMsg);
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
                
                {/* --- KHU VỰC THÔNG TIN CƠ BẢN --- */}
                <h5 className="fw-bold mb-3 border-bottom pb-2">1. Thông tin cơ bản</h5>
                <div className="mb-4">
                  <label className="form-label fw-bold">Tiêu đề tin *</label>
                  <input type="text" name="tieu_de" className="form-control form-control-lg rounded-3" value={formData.tieu_de}
                    placeholder="VD: Phòng trọ giá rẻ gần STU..." required onChange={handleChange} />
                </div>

                <div className="row mb-4 g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Giá thuê (VNĐ) *</label>
                    <input type="number" name="gia_thue" className="form-control py-2 rounded-3" value={formData.gia_thue}
                      placeholder="VD: 3500000" required onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Diện tích (m²) *</label>
                    <input type="number" name="dien_tich" className="form-control py-2 rounded-3" value={formData.dien_tich}
                      placeholder="VD: 25" required onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold" >Loại phòng *</label>
                    <select name="ma_loai_phong" className="form-select py-2 rounded-3" value={formData.ma_loai_phong} onChange={handleChange}>
                      <option value="1">Phòng trọ tiêu chuẩn</option>
                      <option value="2">Căn hộ mini (Studio)</option>
                      <option value="3">Chung cư nguyên căn</option>
                      <option value="4">Ký túc xá (Sleepbox)</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Mô tả chi tiết *</label>
                  <textarea name="mo_ta" className="form-control rounded-3" rows="5" value={formData.mo_ta}
                    placeholder="Mô tả về tiện ích, điện nước, nội thất..." required onChange={handleChange}></textarea>
                </div>

                {/* --- KHU VỰC ĐỊA CHỈ --- */}
                <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">2. Địa chỉ phòng trọ</h5>
                <div className="row mb-4 g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tỉnh/Thành phố *</label>
                    <select name="tinh_thanh_pho" className="form-select py-2 rounded-3" value={formData.tinh_thanh_pho} onChange={handleChange}>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Quận/Huyện *</label>
                    <select name="quan_huyen" className="form-select py-2 rounded-3" value={formData.quan_huyen} onChange={handleChange}>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận 5">Quận 5</option>
                      <option value="Quận 8">Quận 8</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Phường/Xã *</label>
                    <input type="text" name="phuong_xa" className="form-control py-2 rounded-3" placeholder="VD: Phường 4" value={formData.phuong_xa} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Tên đường *</label>
                    <input type="text" name="ten_duong" className="form-control py-2 rounded-3" placeholder="VD: Nguyễn Văn Cừ" value={formData.ten_duong} onChange={handleChange} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Số nhà chi tiết *</label>
                    <input type="text" name="dia_chi_chi_tiet" className="form-control py-2 rounded-3" placeholder="VD: Hẻm 227" value={formData.dia_chi_chi_tiet} onChange={handleChange} required />
                  </div>
                </div>

                {/* --- KHU VỰC TIỆN ÍCH --- */}
                <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">3. Tiện ích có sẵn</h5>
                <div className="d-flex flex-wrap gap-3 mb-4">
                    {[
                        { id: 1, name: 'Điều hòa' },
                        { id: 2, name: 'Máy giặt' },
                        { id: 3, name: 'WC Riêng' },
                        { id: 4, name: 'Chỗ để xe' },
                        { id: 5, name: 'Có gác lửng' }
                    ].map(item => (
                        <div key={item.id} className="form-check form-check-inline m-0">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={`tien_ich_${item.id}`}
                                checked={selectedTienIch.includes(item.id)}
                                onChange={() => handleTienIchChange(item.id)}
                            />
                            <label className="form-check-label" htmlFor={`tien_ich_${item.id}`}>{item.name}</label>
                        </div>
                    ))}
                </div>

                {/* --- KHU VỰC HÌNH ẢNH --- */}
                <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">4. Hình ảnh phòng trọ</h5>
                <div className="mb-4">
                    <label className="d-block w-100 p-4 border border-2 border-dashed rounded-4 text-center bg-light" style={{cursor: 'pointer'}}>
                        <input type="file" multiple accept="image/*" className="d-none" onChange={handleFileChange} />
                        <ImagePlus size={40} className="text-secondary mb-2" />
                        <p className="mb-0 fw-medium text-primary">Nhấn để tải ảnh lên (Nhiều ảnh)</p>
                        <small className="text-muted">Ảnh đầu tiên sẽ được chọn làm ảnh bìa.</small>
                    </label>

                    {/* Previews */}
                    {previews.length > 0 && (
                        <div className="d-flex gap-3 mt-3 overflow-auto pb-2">
                            {previews.map((src, idx) => (
                                <div key={idx} className="position-relative border rounded overflow-hidden flex-shrink-0" style={{width: '100px', height: '100px'}}>
                                    <img src={src} alt="preview" className="w-100 h-100" style={{objectFit: 'cover'}} />
                                    {idx === 0 && <span className="position-absolute bottom-0 start-0 w-100 bg-primary text-white text-center" style={{fontSize: '10px'}}>Ảnh bìa</span>}
                                    <button 
                                        type="button" 
                                        onClick={() => removeImage(idx)}
                                        className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 d-flex align-items-center justify-content-center" 
                                        style={{width: '20px', height: '20px'}}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Trạng thái (chỉ hiện khi sửa) */}
                {editData && (
                  <div className="mb-5 mt-4">
                    <label className="form-label fw-bold">Trạng thái hiển thị</label>
                    <select name="trang_thai" className="form-select py-2 rounded-3 bg-light" value={formData.trang_thai} onChange={handleChange}>
                      <option value="hoat_dong">Đang hoạt động</option>
                      <option value="cho_duyet">Chờ duyệt</option>
                      <option value="da_cho_thue">Đã cho thuê</option>
                    </select>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold fs-5 mt-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Đang tải dữ liệu & Hình ảnh...</>
                  ) : (
                    <><Send size={20} /> {editData ? "Lưu thay đổi" : "Đăng tin ngay"}</>
                  )}
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DangTin;