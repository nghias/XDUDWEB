import React, { useState } from "react";
import { MapPin, DollarSign, Navigation } from "lucide-react";

const HomeView = () => {
  // Mock data dựa trên đúng bảng 'posts' trong Database
  const [rooms] = useState([
    {
      id: 1,
      title: "Phòng trọ giá rẻ gần Đại học Công nghệ Sài Gòn (STU)",
      price: 2500000,
      address: "180 Cao Lỗ, Quận 8",
      area: 20,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    },
    {
      id: 2,
      title: "Căn hộ mini Full nội thất - View Landmark 81",
      price: 5000000,
      address: "Đường Tôn Đản, Quận 4",
      area: 35,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    },
    {
      id: 3,
      title: "Phòng trọ sinh viên có gác lửng, không chung chủ",
      price: 3200000,
      address: "Dương Bá Trạc, Quận 8",
      area: 25,
      image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500",
    },
  ]);

  return (
    <div className="bg-light pb-5">
      {/* Main Content */}
      <main className="container pt-4">
        <h3 className="h5 fw-bold text-dark mb-4 d-flex align-items-center gap-2">
          <Navigation size={22} className="text-primary" />
          Phòng trọ nổi bật quanh khu vực của bạn
        </h3>

        {/* Grid danh sách phòng dùng Bootstrap Row/Col */}
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room.id} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden custom-card-hover">
                
                {/* Ảnh phòng trọ */}
                <img
                  src={room.image}
                  alt={room.title}
                  className="card-img-top"
                  style={{ height: '220px', objectFit: 'cover' }}
                />

                <div className="card-body d-flex flex-column">
                  {/* Tiêu đề */}
                  <h5 className="card-title fw-bold text-dark text-truncate" title={room.title}>
                    {room.title}
                  </h5>

                  {/* Địa chỉ */}
                  <div className="d-flex align-items-center text-secondary small mb-3">
                    <MapPin size={16} className="text-danger me-1 flex-shrink-0" />
                    <span className="text-truncate">{room.address}</span>
                  </div>

                  {/* Giá và Diện tích */}
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div className="text-primary fw-bold fs-5 d-flex align-items-center">
                      <DollarSign size={18} />
                      {(room.price / 1000000).toFixed(1)} triệu/tháng
                    </div>
                    <span className="text-muted small">{room.area} m²</span>
                  </div>

                  {/* Nút xem chi tiết */}
                  <button className="btn btn-dark w-100 mt-3 py-2 rounded-3 fw-medium">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CSS tùy chỉnh nhỏ cho hiệu ứng hover card */}
      <style>{`
        .custom-card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .custom-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default HomeView;