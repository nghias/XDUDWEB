import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Send, AlertCircle, ImagePlus, X } from "lucide-react";

const DangTin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [loading, setLoading] = useState(false);

  // --- STATE DANH MỤC TỪ DATABASE ---
  const [danhMucLoaiPhong, setDanhMucLoaiPhong] = useState([]);
  const [danhMucTienIch, setDanhMucTienIch] = useState([]);

  // --- STATE TỈNH/QUẬN/PHƯỜNG (Dùng API mở của VN) ---
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // --- STATE HÌNH ẢNH & TIỆN ÍCH ---
  const [selectedImages, setSelectedImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); // Ảnh cũ khi Sửa
  const [selectedTienIch, setSelectedTienIch] = useState([]);

  // --- STATE FORM TEXT ---
  const [formData, setFormData] = useState({
    tieu_de: "",
    mo_ta: "",
    gia_thue: "",             
    dien_tich: "",
    ma_loai_phong: "",
    trang_thai: "hoat_dong",
    tinh_thanh_pho: "",
    quan_huyen: "",
    phuong_xa: "",
    ten_duong: "",
    dia_chi_chi_tiet: ""
  });

  const API_URL = "https://xdudweb-php.onrender.com";

  // 1. CHẠY KHI VỪA MỞ TRANG: Load Danh mục & API Tỉnh Thành
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      alert("Bạn cần đăng nhập!");
      navigate("/login");
      return;
    }

    // Lấy Danh mục từ Backend của bạn
    axios.get(`${API_URL}/api/loai-phong`).then(res => setDanhMucLoaiPhong(res.data));
    axios.get(`${API_URL}/api/tien-ich`).then(res => setDanhMucTienIch(res.data));

    // Lấy Tỉnh/Thành từ API mở
    axios.get('https://provinces.open-api.vn/api/p/').then(res => setProvinces(res.data));
  }, [navigate]);

  // 2. Load API Quận/Huyện khi Tỉnh thay đổi
  useEffect(() => {
    if (formData.tinh_thanh_pho) {
      const code = provinces.find(p => p.name === formData.tinh_thanh_pho)?.code;
      if (code) axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`).then(res => setDistricts(res.data.districts));
    }
  }, [formData.tinh_thanh_pho, provinces]);

  // 3. Load API Phường/Xã khi Quận thay đổi
  useEffect(() => {
    if (formData.quan_huyen) {
      const code = districts.find(d => d.name === formData.quan_huyen)?.code;
      if (code) axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`).then(res => setWards(res.data.wards));
    }
  }, [formData.quan_huyen, districts]);


  // 4. LOAD DỮ LIỆU CŨ NẾU LÀ "SỬA TIN"
  useEffect(() => {
    if (editData && danhMucLoaiPhong.length > 0) {
      setFormData({
        tieu_de: editData.tieu_de || "",
        mo_ta: editData.mo_ta || "",
        gia_thue: editData.gia_thue || editData.gia || "",
        dien_tich: editData.dien_tich || "",
        ma_loai_phong: String(editData.ma_loai_phong || danhMucLoaiPhong[0]?.id),
        trang_thai: editData.trang_thai || "hoat_dong",
        tinh_thanh_pho: editData.vi_tri?.tinh_thanh_pho || "",
        quan_huyen: editData.vi_tri?.quan_huyen || "",
        phuong_xa: editData.vi_tri?.phuong_xa || "",
        ten_duong: editData.vi_tri?.ten_duong || "",
        dia_chi_chi_tiet: editData.vi_tri?.dia_chi_chi_tiet || "",
      });

      // Load Tiện ích cũ
      if (editData.tien_ich) {
        setSelectedTienIch(editData.tien_ich.map(item => item.id));
      }
      
      // Load Ảnh cũ
      if (editData.hinh_anh) {
        setExistingImages(editData.hinh_anh);
      }
    } else if (danhMucLoaiPhong.length > 0 && !formData.ma_loai_phong) {
        // Gán default cho Form Tạo mới
        setFormData(prev => ({...prev, ma_loai_phong: String(danhMucLoaiPhong[0]?.id)}));
    }
  }, [editData, danhMucLoaiPhong]);

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTienIchChange = (id) => {
    setSelectedTienIch(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages([...selectedImages, ...files]); // Cho phép chọn thêm nhiều lần
    setPreviews([...previews, ...files.map(file => URL.createObjectURL(file))]);
  };

  const removeNewImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("auth_token");
    const userData = JSON.parse(localStorage.getItem("user_session"));
    
    const dataToSend = new FormData();
    dataToSend.append('tieu_de', formData.tieu_de);
    dataToSend.append('mo_ta', formData.mo_ta);
    dataToSend.append('gia_thue', formData.gia_thue);
    dataToSend.append('dien_tich', formData.dien_tich);
    dataToSend.append('ma_chu_nha', userData?.id);
    dataToSend.append('ma_loai_phong', formData.ma_loai_phong);
    dataToSend.append('trang_thai', formData.trang_thai);
    
    dataToSend.append('tinh_thanh_pho', formData.tinh_thanh_pho);
    dataToSend.append('quan_huyen', formData.quan_huyen);
    dataToSend.append('phuong_xa', formData.phuong_xa);
    dataToSend.append('ten_duong', formData.ten_duong);
    dataToSend.append('dia_chi_chi_tiet', formData.dia_chi_chi_tiet);

    selectedTienIch.forEach(id => dataToSend.append('tien_ich[]', id));
    selectedImages.forEach(file => dataToSend.append('hinh_anh[]', file));

    if (editData) dataToSend.append('_method', 'PUT');

    try {
      const url = editData ? `${API_URL}/api/cap-nhat-tin-dang/${editData.id}` : `${API_URL}/api/tao-tin-dang`;

      await axios.post(url, dataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert(editData ? "Cập nhật tin đăng thành công!" : "Đăng tin thành công!");
      navigate("/quan-ly-tin-dang"); 
    } catch (error) {
      console.error(error);
      alert("Lỗi: " + (error.response?.data?.message || "Kiểm tra lại dữ liệu"));
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
                
                {/* --- 1. THÔNG TIN CƠ BẢN --- */}
                <h5 className="fw-bold mb-3 border-bottom pb-2">1. Thông tin cơ bản</h5>
                <div className="mb-4">
                  <label className="form-label fw-bold">Tiêu đề tin *</label>
                  <input type="text" name="tieu_de" className="form-control form-control-lg rounded-3" value={formData.tieu_de} required onChange={handleChange} />
                </div>

                <div className="row mb-4 g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Giá thuê (VNĐ) *</label>
                    <input type="number" name="gia_thue" className="form-control py-2 rounded-3" value={formData.gia_thue} required onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Diện tích (m²) *</label>
                    <input type="number" name="dien_tich" className="form-control py-2 rounded-3" value={formData.dien_tich} required onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Loại phòng *</label>
                    <select name="ma_loai_phong" className="form-select py-2 rounded-3" value={formData.ma_loai_phong} onChange={handleChange}>
                      {danhMucLoaiPhong.map(loai => (
                         <option key={loai.id} value={loai.id}>{loai.ten_loai}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Mô tả chi tiết *</label>
                  <textarea name="mo_ta" className="form-control rounded-3" rows="5" value={formData.mo_ta} required onChange={handleChange}></textarea>
                </div>

                {/* --- 2. ĐỊA CHỈ (Động) --- */}
                <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">2. Địa chỉ phòng trọ</h5>
                <div className="row mb-4 g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Tỉnh/Thành phố *</label>
                    <select name="tinh_thanh_pho" className="form-select py-2 rounded-3" value={formData.tinh_thanh_pho} onChange={handleChange} required>
                      <option value="">Chọn Tỉnh/Thành</option>
                      {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Quận/Huyện *</label>
                    <select name="quan_huyen" className="form-select py-2 rounded-3" value={formData.quan_huyen} onChange={handleChange} disabled={!formData.tinh_thanh_pho} required>
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Phường/Xã *</label>
                    <select name="phuong_xa" className="form-select py-2 rounded-3" value={formData.phuong_xa} onChange={handleChange} disabled={!formData.quan_huyen} required>
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tên đường *</label>
                    <input type="text" name="ten_duong" className="form-control py-2 rounded-3" value={formData.ten_duong} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Số nhà chi tiết *</label>
                    <input type="text" name="dia_chi_chi_tiet" className="form-control py-2 rounded-3" value={formData.dia_chi_chi_tiet} onChange={handleChange} required />
                  </div>
                </div>

                {/* --- 3. TIỆN ÍCH TỪ DATABASE --- */}
                <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">3. Tiện ích có sẵn</h5>
                <div className="d-flex flex-wrap gap-3 mb-4">
                    {danhMucTienIch.map(item => (
                        <div key={item.id} className="form-check form-check-inline m-0 border px-3 py-2 rounded-3 bg-white shadow-sm">
                            <input 
                                className="form-check-input me-2" 
                                type="checkbox" 
                                id={`tien_ich_${item.id}`}
                                checked={selectedTienIch.includes(item.id)}
                                onChange={() => handleTienIchChange(item.id)}
                            />
                            <label className="form-check-label text-dark" htmlFor={`tien_ich_${item.id}`}>
                                {item.ten_tien_ich}
                            </label>
                        </div>
                    ))}
                </div>

                {/* --- 4. HÌNH ẢNH --- */}
                <h5 className="fw-bold mt-5 mb-3 border-bottom pb-2">4. Hình ảnh phòng trọ</h5>
                <div className="mb-4">
                    <label className="d-block w-100 p-4 border border-2 border-dashed rounded-4 text-center bg-light" style={{cursor: 'pointer'}}>
                        <input type="file" multiple accept="image/*" className="d-none" onChange={handleFileChange} />
                        <ImagePlus size={40} className="text-secondary mb-2" />
                        <p className="mb-0 fw-medium text-primary">Nhấn để tải ảnh lên (Có thể chọn nhiều)</p>
                        {editData && <small className="text-danger mt-2 d-block">*Nếu tải lên ảnh mới, hệ thống sẽ xóa toàn bộ ảnh cũ.</small>}
                    </label>

                    <div className="d-flex gap-3 mt-3 overflow-auto pb-2">
                        {/* Hiển thị Ảnh Cũ (nếu có và chưa chọn ảnh mới) */}
                        {editData && previews.length === 0 && existingImages.map((img) => (
                            <div key={img.id} className="position-relative border rounded overflow-hidden flex-shrink-0" style={{width: '100px', height: '100px'}}>
                                <img src={`${API_URL}${img.duong_dan_anh}`} alt="Cũ" className="w-100 h-100" style={{objectFit: 'cover', opacity: 0.8}} />
                                {img.la_anh_bia === 1 && <span className="position-absolute bottom-0 w-100 bg-success text-white text-center" style={{fontSize: '10px'}}>Ảnh bìa</span>}
                            </div>
                        ))}

                        {/* Hiển thị Ảnh Mới upload */}
                        {previews.map((src, idx) => (
                            <div key={idx} className="position-relative border border-primary rounded overflow-hidden flex-shrink-0 shadow-sm" style={{width: '100px', height: '100px'}}>
                                <img src={src} alt="preview" className="w-100 h-100" style={{objectFit: 'cover'}} />
                                {idx === 0 && <span className="position-absolute bottom-0 start-0 w-100 bg-primary text-white text-center" style={{fontSize: '10px'}}>Ảnh bìa</span>}
                                <button type="button" onClick={() => removeNewImage(idx)} className="position-absolute top-0 end-0 btn btn-sm btn-danger p-0 d-flex align-items-center justify-content-center" style={{width: '20px', height: '20px'}}>
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

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

                <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 rounded-pill fw-bold fs-5 mt-4 d-flex align-items-center justify-content-center gap-2 shadow-sm">
                  {loading ? <><Loader2 className="animate-spin" /> Đang xử lý...</> : <><Send size={20} /> {editData ? "Lưu thay đổi" : "Đăng tin ngay"}</>}
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