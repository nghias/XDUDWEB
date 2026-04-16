import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Navigation,
  Loader2,
  ArrowRight,
  Filter,
  Search,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // Trạng thái ẩn/hiện bộ lọc
  const [searchParams, setSearchParams] = useSearchParams();
  const DEFAULT_ROOM_IMAGE =
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000";

  // State lưu trữ các tham số tìm kiếm (khớp với tên biến của Backend)
  const [filters, setFilters] = useState({
    tu_khoa: searchParams.get("tu_khoa") || "",
    gia_tu: "",
    gia_den: "",
    dien_tich_tu: "",
    dien_tich_den: "",
    ma_loai_phong: "",
    tinh_thanh_pho: "",
    quan_huyen: "",
  });

  const API_BASE_URL = "https://xdudweb-php.onrender.com";

  // Hàm gọi API lấy dữ liệu
  const fetchFilteredData = async () => {
    setLoading(true);
    try {
      // Chỉ gửi đi những param có dữ liệu
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== "") {
          params.append(key, filters[key]);
        }
      });

      // Gọi API tìm kiếm nâng cao
      const response = await axios.get(
        `${API_BASE_URL}/api/tim-kiem-tin-dang?${params.toString()}`,
      );

      // Chú ý: Backend mới trả về cục data nằm trong response.data.data
      setRooms(response.data.data || []);
    } catch (error) {
      console.error("Lỗi kết nối API:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lần đầu khi load trang (Hoặc khi có thay đổi trên URL)
  useEffect(() => {
    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Xử lý khi nhập liệu vào Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Submit Form
  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredData();
  };

  // Reset bộ lọc
  const handleReset = () => {
    const resetValues = {
      tu_khoa: "",
      gia_tu: "",
      gia_den: "",
      dien_tich_tu: "",
      dien_tich_den: "",
      ma_loai_phong: "",
      tinh_thanh_pho: "",
      quan_huyen: "",
    };
    setFilters(resetValues);
    setSearchParams({}); // Xóa param trên URL

    // Gọi lại API ngay lập tức với bộ filter trống
    axios
      .get(`${API_BASE_URL}/api/tim-kiem-tin-dang`)
      .then((res) => setRooms(res.data.data || []))
      .catch((err) => console.error(err));
  };

  const getMockImage = (id) => {
    return `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop&sig=${id}`;
  };

  return (
    <div className="bg-light pb-5 min-vh-100">
      <main className="container pt-4">
        {/* HEADER VÀ NÚT MỞ BỘ LỌC */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <header className="d-flex align-items-center gap-2">
            <Navigation size={24} className="text-primary" />
            <h3 className="h4 fw-bold text-dark m-0">Tin đăng mới nhất</h3>
          </header>
          <button
            className={`btn fw-medium d-flex align-items-center gap-2 ${showFilters ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setShowFilters(!showFilters)}
            style={{ borderRadius: "8px" }}
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
            {showFilters ? "Đóng bộ lọc" : "Lọc kết quả"}
          </button>
        </div>

        {/* GIAO DIỆN BỘ LỌC TÌM KIẾM (Collapse) */}
        {showFilters && (
          <div className="card shadow-sm border-0 mb-4 rounded-4 animate-fade-in">
            <div className="card-body p-4">
              <form onSubmit={handleSearch}>
                <div className="row g-3">
                  {/* Từ khóa */}
                  <div className="col-12 col-md-4">
                    <label className="form-label text-muted small fw-bold">
                      Từ khóa
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Search size={16} />
                      </span>
                      <input
                        type="text"
                        name="tu_khoa"
                        className="form-control border-start-0 bg-light"
                        placeholder="Tên đường, phường, mô tả..."
                        value={filters.tu_khoa}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Loại phòng */}
                  <div className="col-12 col-md-4">
                    <label className="form-label text-muted small fw-bold">
                      Loại phòng
                    </label>
                    <select
                      name="ma_loai_phong"
                      className="form-select bg-light"
                      value={filters.ma_loai_phong}
                      onChange={handleInputChange}
                    >
                      <option value="">Tất cả loại phòng</option>
                      <option value="1">Phòng trọ</option>
                      <option value="2">Căn hộ dịch vụ</option>
                      <option value="3">Nhà nguyên căn</option>
                    </select>
                  </div>

                  {/* Khu vực (Quận) */}
                  <div className="col-12 col-md-4">
                    <label className="form-label text-muted small fw-bold">
                      Quận/Huyện
                    </label>
                    <input
                      type="text"
                      name="quan_huyen"
                      className="form-control bg-light"
                      placeholder="VD: Quận 1, Tân Bình..."
                      value={filters.quan_huyen}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Mức giá */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">
                      Mức giá (VNĐ)
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        name="gia_tu"
                        className="form-control bg-light"
                        placeholder="Từ..."
                        value={filters.gia_tu}
                        onChange={handleInputChange}
                      />
                      <span className="text-muted">-</span>
                      <input
                        type="number"
                        name="gia_den"
                        className="form-control bg-light"
                        placeholder="Đến..."
                        value={filters.gia_den}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Diện tích */}
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">
                      Diện tích (m²)
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        name="dien_tich_tu"
                        className="form-control bg-light"
                        placeholder="Từ..."
                        value={filters.dien_tich_tu}
                        onChange={handleInputChange}
                      />
                      <span className="text-muted">-</span>
                      <input
                        type="number"
                        name="dien_tich_den"
                        className="form-control bg-light"
                        placeholder="Đến..."
                        value={filters.dien_tich_den}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <div className="col-12 mt-4 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-light border text-secondary px-4 fw-medium"
                      onClick={handleReset}
                    >
                      Xóa lọc
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4 fw-medium d-flex align-items-center gap-2"
                    >
                      <Search size={16} /> Áp dụng tìm kiếm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LOADING VÀ DANH SÁCH TIN ĐĂNG */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center flex-column py-5 my-5">
            <Loader2 className="animate-spin text-primary mb-2" size={40} />
            <p className="text-muted fw-medium">
              Đang tìm kiếm dữ liệu phù hợp...
            </p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-5 my-5">
            <img
              src="https://cdn-icons-png.flaticon.com/512/7486/7486831.png"
              alt="No data"
              width="120"
              className="opacity-50 mb-3"
            />
            <h5 className="text-muted fw-bold">Không tìm thấy tin đăng nào!</h5>
            <p className="text-secondary small">
              Vui lòng thử lại với các tiêu chí tìm kiếm khác.
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {rooms.map((room) => (
              <div key={room.id} className="col-12 col-md-6 col-lg-4">
                <Link
                  to={`/chi-tiet-tin-dang/${room.id}`}
                  className="text-decoration-none"
                >
                  <article className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden custom-card-hover">
                    <div
                      style={{ height: "220px", backgroundColor: "#e9ecef" }}
                    >
                      <img
                        src={
                          // Bước 1: Kiểm tra xem mảng hinh_anh có tồn tại và có phần tử không
                          room.hinh_anh && room.hinh_anh.length > 0
                            ? // Bước 2: Tìm ảnh có la_anh_bia = 1, nếu không có thì lấy đại cái [0]
                              (
                                room.hinh_anh.find(
                                  (img) => img.la_anh_bia === 1,
                                ) || room.hinh_anh[0]
                              ).duong_dan_anh
                            : DEFAULT_ROOM_IMAGE // Bước 3: Nếu mảng rỗng thì dùng ngay ảnh mock
                        }
                        alt={room.tieu_de}
                        className="w-100 h-100"
                        style={{ objectFit: "cover" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_ROOM_IMAGE;
                        }}
                      />
                    </div>
                    <div className="card-body d-flex flex-column p-4">
                      <h5
                        className="card-title fw-bold text-dark text-truncate mb-2"
                        title={room.tieu_de}
                      >
                        {room.tieu_de}
                      </h5>
                      <div className="d-flex align-items-center text-secondary small mb-3">
                        <MapPin
                          size={16}
                          className="text-danger me-1 flex-shrink-0"
                        />
                        <span className="text-truncate">
                          {room.vi_tri?.ten_duong ||
                            room.vi_tri?.ten_vi_tri ||
                            "Chưa cập nhật địa điểm"}
                        </span>
                      </div>
                      <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
                        <div>
                          <span className="text-primary fw-bold fs-5">
                            {(Number(room.gia_thue) / 1000000).toFixed(1)}tr
                          </span>
                          <span className="text-muted small ms-1">/tháng</span>
                        </div>
                        <button className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 fw-medium">
                          Chi tiết <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .custom-card-hover { transition: all 0.3s ease; border: 1px solid transparent; }
        .custom-card-hover:hover { 
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
            border-color: rgba(13, 138, 188, 0.2);
        }
        .btn-outline-primary:hover { background-color: #0d6efd; color: white; }
        .input-group-text { border-color: #dee2e6; }
        .form-control, .form-select { border-color: #dee2e6; }
        .form-control:focus, .form-select:focus { box-shadow: none; border-color: #0d6efd; }
      `}</style>
    </div>
  );
};

export default Home;
