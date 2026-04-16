import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// Thêm import Phone và MessageCircle từ lucide-react để làm icon cho nút
import { MapPin, DollarSign, Home, Loader2, Phone, MessageCircle } from "lucide-react";

const ChiTietTinDang = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`https://xdudweb-php.onrender.com/api/chi-tiet-tin-dang/${id}`);
        setRoom(response.data);
      } catch (error) {
        console.error("Lỗi lấy chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center mt-5"><Loader2 className="animate-spin" /> Đang tải chi tiết...</div>;
  if (!room) return <div className="text-center mt-5">Không tìm thấy thông tin phòng này.</div>;

  // Lấy số điện thoại của chủ nhà từ API
  const soDienThoai = room.nguoi_dung?.so_dien_thoai;

  return (
    <div className="container mt-4 pb-5">
      <div className="row">

        {/* Phần hình ảnh + ảnh bìa */}
<div className="col-lg-8">
  <div className="position-relative">
    <img 
      src={
        room.hinh_anh && room.hinh_anh.length > 0 
          ? (room.hinh_anh.find(img => img.la_anh_bia === 1)?.duong_dan_anh || room.hinh_anh[0].duong_dan_anh)
          : "https://via.placeholder.com/800x450?text=Chua+Co+Anh"
      } 
      className="img-fluid rounded-4 shadow-sm w-100" 
      style={{ maxHeight: '500px', objectFit: 'cover' }}
      alt={room.tieu_de} 
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000";
      }}
    />
  </div>

  {/* Danh sách các ảnh phụ */}
  {room.hinh_anh && room.hinh_anh.length > 1 && (
    <div className="d-flex gap-2 mt-3 overflow-auto pb-2">
      {room.hinh_anh.map((img, index) => (
        <img 
          key={index}
          src={img.duong_dan_anh} 
          className="rounded-3 border" 
          style={{ width: '120px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
          alt={`Ảnh phụ ${index}`}
          onClick={(e) => {
             // Logic để khi click vào ảnh nhỏ thì ảnh to ở trên thay đổi (nếu ông muốn làm thêm)
             document.querySelector('.img-fluid').src = img.duong_dan_anh;
          }}
        />
      ))}
    </div>
  )}
          
          <h1 className="fw-bold mt-4">{room.tieu_de}</h1>
          <p className="text-muted d-flex align-items-center gap-2">
            <MapPin size={18} className="text-danger" /> {room.vi_tri?.ten_vi_tri || "Chưa cập nhật địa điểm"}
          </p>
          <hr />
          <h4 className="fw-bold">Mô tả chi tiết</h4>
          <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{room.mo_ta || "Chưa có mô tả cho tin đăng này."}</p>
        </div>

        {/* Phần thông tin giá và chủ nhà bên phải */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 sticky-top" style={{ top: '100px' }}>
            <div className="mb-3">
              <span className="text-primary fw-bold fs-3">
                {(Number(room.gia_thue) / 1000000).toFixed(1)} triệu
              </span>
              <span className="text-muted">/tháng</span>
            </div>
            
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4">
               <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.nguoi_dung?.ho_ten || 'User')}&background=0D8ABC&color=fff`} 
                className="rounded-circle" width="50" alt="avatar" 
               />
               <div>
                  <div className="fw-bold">{room.nguoi_dung?.ho_ten || "Chủ nhà"}</div>
                  <div className="small text-success fw-medium">Đang hoạt động</div>
               </div>
            </div>

            {/* KIỂM TRA: Nếu có số điện thoại thì hiện nút, không có thì báo lỗi */}
            {soDienThoai ? (
              <>
                {/* Nút Gọi Điện: Dùng href="tel:..." */}
                <a 
                  href={`tel:${soDienThoai}`} 
                  className="btn btn-primary w-100 fw-bold py-2 mb-2 d-flex justify-content-center align-items-center gap-2"
                >
                  <Phone size={18} /> Liên hệ: {soDienThoai}
                </a>

                {/* Nút Zalo: Dùng href="https://zalo.me/..." */}
                <a 
                  href={`https://zalo.me/${soDienThoai}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-success w-100 fw-bold py-2 d-flex justify-content-center align-items-center gap-2"
                >
                  <MessageCircle size={18} /> Nhắn tin Zalo
                </a>
              </>
            ) : (
              <button className="btn btn-secondary w-100 fw-bold py-2" disabled>
                Chủ nhà chưa cập nhật SĐT
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiTietTinDang;