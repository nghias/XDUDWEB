import React, { useState } from "react";
import { MapPin, Search, Home, DollarSign, Navigation } from "lucide-react";

const HomeView = () => {
  // Mock data dựa trên đúng bảng 'posts' trong Database của nhóm Nghĩa
  const [rooms] = useState([
    {
      id: 1,
      title: "Phòng trọ giá rẻ gần Đại học Công nghệ Sài Gòn (STU)",
      price: 2500000,
      address: "180 Cao Lỗ, Quận 8",
      area: 20,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    },
    {
      id: 2,
      title: "Căn hộ mini Full nội thất - View Landmark 81",
      price: 5000000,
      address: "Đường Tôn Đản, Quận 4",
      area: 35,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500",
    },
    {
      id: 3,
      title: "Phòng trọ sinh viên có gác lửng, không chung chủ",
      price: 3200000,
      address: "Dương Bá Trạc, Quận 8",
      area: 25,
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500",
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header đơn giản */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Home size={28} />
            <h1 className="text-2xl font-bold text-white uppercase">
              STU Accommodation
            </h1>
          </div>
          <div className="hidden md:flex bg-white rounded-full px-4 py-2 items-center gap-2 text-gray-500">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm quận, tên đường..."
              className="outline-none text-sm w-64"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <Navigation size={20} className="text-blue-600" />
          Phòng trọ nổi bật quanh khu vực của bạn
        </h2>

        {/* Grid danh sách phòng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg line-clamp-1">
                  {room.title}
                </h3>

                <div className="flex items-center text-gray-500 mt-2 text-sm">
                  <MapPin size={14} className="mr-1 text-red-500" />
                  {room.address}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <div className="flex items-center text-blue-700 font-bold text-lg">
                    <DollarSign size={16} />
                    {(room.price / 1000000).toFixed(1)} triệu/tháng
                  </div>
                  <span className="text-gray-400 text-sm">{room.area} m²</span>
                </div>

                <button className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-10 text-gray-400 text-sm">
        © 2026 - Dự án Website Đặt Phòng Trọ - Nhóm Nghĩa & Khang
      </footer>
    </div>
  );
};

export default HomeView;
