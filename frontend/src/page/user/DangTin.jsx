import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2, Send, ImagePlus, X, MapPin, Home, ArrowLeft } from "lucide-react"; // Thêm ArrowLeft ở đây

const DangTin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [loading, setLoading] = useState(false);

  // Danh mục dữ liệu
  const [danhMucLoaiPhong, setDanhMucLoaiPhong] = useState([]);
  const [danhMucTienIch, setDanhMucTienIch] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Quản lý hình ảnh và tiện ích
  const [selectedImages, setSelectedImages] = useState([]); 
  const [previews, setPreviews] = useState([]); 
  const [selectedTienIch, setSelectedTienIch] = useState([]);

  const [formData, setFormData] = useState({
    tieu_de: "", mo_ta: "", gia_thue: "", dien_tich: "",
    ma_loai_phong: "", trang_thai: "hoat_dong",
    tinh_thanh_pho: "", quan_huyen: "", phuong_xa: "", ten_duong: "", dia_chi_chi_tiet: ""
  });

  const API_URL = "https://xdudweb-php.onrender.com";

  // 1. Load danh mục ban đầu
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) { navigate("/login"); return; }

    const fetchData = async () => {
        try {
            const [lp, ti, p] = await Promise.all([
                axios.get(`${API_URL}/api/loai-phong`),
                axios.get(`${API_URL}/api/tien-ich`),
                axios.get('https://provinces.open-api.vn/api/p/')
            ]);
            setDanhMucLoaiPhong(lp.data);
            setDanhMucTienIch(ti.data);
            setProvinces(p.data);

            // Gán giá trị mặc định nếu là đăng tin mới
            if (!editData && lp.data.length > 0) {
                setFormData(prev => ({ ...prev, ma_loai_phong: lp.data[0].id }));
            }
        } catch (err) { console.error("Lỗi load danh mục", err); }
    };
    fetchData();
  }, [navigate, editData]);

  // 2. Load Quận/Huyện khi Tỉnh thay đổi
  useEffect(() => {
    if (formData.tinh_thanh_pho) {
      const code = provinces.find(p => p.name === formData.tinh_thanh_pho)?.code;
      if (code) axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`).then(res => setDistricts(res.data.districts));
    }
  }, [formData.tinh_thanh_pho, provinces]);

  // 3. Load Phường/Xã khi Quận thay đổi
  useEffect(() => {
    if (formData.quan_huyen) {
      const code = districts.find(d => d.name === formData.quan_huyen)?.code;
      if (code) axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`).then(res => setWards(res.data.wards));
    }
  }, [formData.quan_huyen, districts]);

  // 4. Đổ dữ liệu cũ vào Form khi Sửa
  useEffect(() => {
    if (editData) {
      setFormData({
        tieu_de: editData.tieu_de || "",
        mo_ta: editData.mo_ta || "",
        gia_thue: editData.gia_thue || editData.gia || "",
        dien_tich: editData.dien_tich || "",
        ma_loai_phong: String(editData.ma_loai_phong || ""),
        trang_thai: editData.trang_thai || "hoat_dong",
        tinh_thanh_pho: editData.vi_tri?.tinh_thanh_pho || "",
        quan_huyen: editData.vi_tri?.quan_huyen || "",
        phuong_xa: editData.vi_tri?.phuong_xa || "",
        ten_duong: editData.vi_tri?.ten_duong || "",
        dia_chi_chi_tiet: editData.vi_tri?.dia_chi_chi_tiet || "",
      });
      if (editData.tien_ich) setSelectedTienIch(editData.tien_ich.map(i => i.id));
      // Hiển thị ảnh cũ từ database (link Cloudinary)
      if (editData.hinh_anh) setPreviews(editData.hinh_anh.map(img => img.duong_dan_anh));
    }
  }, [editData]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("auth_token");
    const userData = JSON.parse(localStorage.getItem("user_session"));
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('ma_chu_nha', userData?.id);
    selectedTienIch.forEach(id => data.append('tien_ich[]', id));
    selectedImages.forEach(file => data.append('hinh_anh[]', file));
    
    if (editData) data.append('_method', 'PUT');

    try {
      const url = editData ? `${API_URL}/api/cap-nhat-tin-dang/${editData.id}` : `${API_URL}/api/tao-tin-dang`;
      await axios.post(url, data, { 
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } 
      });
      alert(editData ? "Cập nhật thành công!" : "Đăng tin thành công!");
      navigate("/quan-ly-tin-dang");
    } catch (error) {
      console.error(error.response?.data);
      alert("Lỗi: " + (error.response?.data?.message || "Dữ liệu không hợp lệ"));
    } finally { setLoading(false); }
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          
          {/* THÊM NÚT QUAY LẠI TẠI ĐÂY */}
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="btn btn-link text-decoration-none text-secondary d-flex align-items-center gap-2 mb-3 px-0 fw-medium"
            style={{ width: 'fit-content' }}
          >
            <ArrowLeft size={20} /> Quay lại
          </button>

          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="bg-primary p-4 text-white d-flex align-items-center gap-3">
              <div className="p-3 bg-white bg-opacity-25 rounded-circle"><Home size={32}/></div>
              <div>
                <h3 className="fw-bold mb-0">{editData ? "Chỉnh sửa tin đăng" : "Đăng tin cho thuê mới"}</h3>
                <p className="mb-0 opacity-75">Thông tin càng chi tiết, khách thuê càng dễ tìm thấy bạn</p>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                {/* 1. THÔNG TIN CƠ BẢN */}
                <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:24, height:24, fontSize:12}}>1</div>
                    <h5 className="fw-bold mb-0">Thông tin cơ bản</h5>
                </div>
                
                <div className="mb-4">
                  <label className="form-label fw-medium">Tiêu đề tin đăng <span className="text-danger">*</span></label>
                  <input type="text" className="form-control form-control-lg" placeholder="VD: Phòng trọ giá rẻ gần STU, đầy đủ tiện nghi..." value={formData.tieu_de} required onChange={(e) => setFormData({...formData, tieu_de: e.target.value})} />
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label fw-medium">Giá thuê (VNĐ/tháng)</label>
                    <input type="number" className="form-control" placeholder="3,500,000" value={formData.gia_thue} required onChange={(e) => setFormData({...formData, gia_thue: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-medium">Diện tích (m²)</label>
                    <input type="number" className="form-control" placeholder="25" value={formData.dien_tich} required onChange={(e) => setFormData({...formData, dien_tich: e.target.value})} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-medium">Loại phòng</label>
                    <select className="form-select" value={formData.ma_loai_phong} onChange={(e) => setFormData({...formData, ma_loai_phong: e.target.value})}>
                      {danhMucLoaiPhong.map(l => <option key={l.id} value={l.id}>{l.ten_loai}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="form-label fw-medium">Mô tả chi tiết</label>
                  <textarea className="form-control" rows="5" placeholder="Mô tả về giờ giấc, điện nước, nội thất..." value={formData.mo_ta} required onChange={(e) => setFormData({...formData, mo_ta: e.target.value})}></textarea>
                </div>

                {/* 2. ĐỊA CHỈ */}
                <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:24, height:24, fontSize:12}}>2</div>
                    <h5 className="fw-bold mb-0">Vị trí & Địa chỉ</h5>
                </div>
                
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <select className="form-select" value={formData.tinh_thanh_pho} onChange={(e) => setFormData({...formData, tinh_thanh_pho: e.target.value})} required>
                      <option value="">Tỉnh/Thành phố</option>
                      {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" value={formData.quan_huyen} onChange={(e) => setFormData({...formData, quan_huyen: e.target.value})} disabled={!formData.tinh_thanh_pho} required>
                      <option value="">Quận/Huyện</option>
                      {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <select className="form-select" value={formData.phuong_xa} onChange={(e) => setFormData({...formData, phuong_xa: e.target.value})} disabled={!formData.quan_huyen} required>
                      <option value="">Phường/Xã</option>
                      {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="row g-3 mb-5">
                    <div className="col-md-5">
                        <input type="text" className="form-control" placeholder="Tên đường" value={formData.ten_duong} required onChange={(e) => setFormData({...formData, ten_duong: e.target.value})} />
                    </div>
                    <div className="col-md-7">
                        <input type="text" className="form-control" placeholder="Số nhà, hẻm chi tiết..." value={formData.dia_chi_chi_tiet} required onChange={(e) => setFormData({...formData, dia_chi_chi_tiet: e.target.value})} />
                    </div>
                </div>

                {/* 3. TIỆN ÍCH */}
                <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:24, height:24, fontSize:12}}>3</div>
                    <h5 className="fw-bold mb-0">Tiện ích đi kèm</h5>
                </div>
                <div className="d-flex flex-wrap gap-2 mb-5">
                  {danhMucTienIch.map(t => (
                    <div key={t.id} 
                        onClick={() => setSelectedTienIch(prev => prev.includes(t.id) ? prev.filter(i => i !== t.id) : [...prev, t.id])}
                        className={`px-3 py-2 rounded-pill border cursor-pointer transition-all ${selectedTienIch.includes(t.id) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-secondary'}`}
                        style={{ cursor: 'pointer' }}
                    >
                      {t.ten_tien_ich}
                    </div>
                  ))}
                </div>

                {/* 4. HÌNH ẢNH */}
                <div className="d-flex align-items-center gap-2 mb-4 text-primary">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width:24, height:24, fontSize:12}}>4</div>
                    <h5 className="fw-bold mb-0">Hình ảnh thực tế</h5>
                </div>
                
                <div className="mb-4">
                    <label className="w-100 p-5 border border-2 border-dashed rounded-4 d-flex flex-column align-items-center justify-content-center bg-light cursor-pointer" style={{ cursor: 'pointer' }}>
                        <input type="file" multiple className="d-none" accept="image/*" onChange={handleFileChange} />
                        <ImagePlus size={48} className="text-secondary mb-2" />
                        <p className="fw-bold text-primary mb-1">Nhấn để tải ảnh lên</p>
                        <p className="text-muted small">Có thể chọn nhiều ảnh cùng lúc</p>
                    </label>

                    {previews.length > 0 && (
                        <div className="d-flex gap-3 mt-4 overflow-auto pb-2">
                            {previews.map((url, i) => (
                                <div key={i} className="position-relative flex-shrink-0 shadow-sm rounded overflow-hidden" style={{width:120, height:120}}>
                                    <img src={url} alt="preview" className="w-100 h-100 object-fit-cover" />
                                    <div className="position-absolute top-0 start-0 bg-dark bg-opacity-50 text-white px-2 py-1" style={{fontSize:10}}>
                                        {i === 0 ? "Ảnh bìa" : `Ảnh ${i+1}`}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-4 border-top mt-5">
                    <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow d-flex align-items-center justify-content-center gap-2 fs-5">
                    {loading ? (
                        <><Loader2 className="animate-spin" /> Đang tải dữ liệu & Hình ảnh...</>
                    ) : (
                        <><Send size={20} /> {editData ? "Xác nhận cập nhật" : "Đăng tin ngay"}</>
                    )}
                    </button>
                    <p className="text-center text-muted small mt-3">Bằng việc nhấn Đăng tin, bạn đồng ý với các Điều khoản dịch vụ của chúng tôi</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangTin;