import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Navigation, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link để điều hướng

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "https://xdudweb-php.onrender.com";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/tat-ca-tin-dang`);
        setRooms(response.data);
      } catch (error) {
        console.error("Lỗi kết nối API:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMockImage = (id) => {
    return `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop&sig=${id}`;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <Loader2 className="animate-spin text-primary mb-2" size={40} />
        <p className="text-muted fw-medium">Đang đồng bộ dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="bg-light pb-5">
      <main className="container pt-4">
        <header className="mb-4 d-flex align-items-center gap-2">
          <Navigation size={22} className="text-primary" />
          <h3 className="h5 fw-bold text-dark m-0">Tin đăng mới nhất</h3>
        </header>

        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-12 col-md-6 col-lg-4">
              {/* Bọc toàn bộ Card bằng Link để click vào đâu cũng xem được chi tiết */}
              <Link to={`/chi-tiet-tin-dang/${room.id}`} className="text-decoration-none">
                <article className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden custom-card-hover">
                  
                  {/* Hình ảnh Mock */}
                  <div style={{ height: '200px', backgroundColor: '#e9ecef' }}>
                    <img
                      src={getMockImage(room.id)} 
                      alt="Demo Room"
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark text-truncate mb-1">{room.tieu_de}</h5>
                    
                    <div className="d-flex align-items-center text-secondary small mb-3">
                      <MapPin size={14} className="text-danger me-1" />
                      <span className="text-truncate">{room.vi_tri?.ten_vi_tri || "Chưa cập nhật địa điểm"}</span>
                    </div>

                    <div className="mt-auto border-top pt-3 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="text-primary fw-bold fs-5">
                          {(Number(room.gia_thue) / 1000000).toFixed(1)}tr
                        </span>
                        <span className="text-muted small ms-1">/tháng</span>
                      </div>
                      
                      {/* NÚT XEM CHI TIẾT */}
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
      </main>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-card-hover { 
            transition: all 0.3s ease; 
        }
        .custom-card-hover:hover { 
            transform: translateY(-8px);
            shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
        }
        .btn-outline-primary:hover {
            background-color: #0d6efd;
            color: white;
        }
      `}</style>
    </div>
  );
};

export default Home;