import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapPin, DollarSign, Home, Loader2 } from "lucide-react";

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

  return (
    <div className="container mt-4 pb-5">
      <div className="row">
        {/* Phần hình ảnh (Tạm thời dùng ảnh mock giống trang Home cho đẹp) */}
        <div className="col-lg-8">
          <img 
            src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000&auto=format&fit=crop&sig=${id}`} 
            className="img-fluid rounded-4 shadow-sm w-100" 
            alt={room.tieu_de} 
          />
          
          <h1 className="fw-bold mt-4">{room.tieu_de}</h1>
          <p className="text-muted d-flex align-items-center gap-2">
            <MapPin size={18} className="text-danger" /> {room.vi_tri?.ten_vi_tri}
          </p>
          <hr />
          <h4 className="fw-bold">Mô tả chi tiết</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{room.mo_ta || "Chưa có mô tả cho tin đăng này."}</p>
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
            
            <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-3">
               <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(room.nguoi_dung?.ho_ten || 'User')}`} 
                className="rounded-circle" width="50" alt="avatar" 
               />
               <div>
                  <div className="fw-bold">{room.nguoi_dung?.ho_ten || "Chủ nhà"}</div>
                  <div className="small text-muted">Đang hoạt động</div>
               </div>
            </div>

            <button className="btn btn-primary w-100 fw-bold py-2 mb-2">Liên hệ ngay</button>
            <button className="btn btn-outline-success w-100 fw-bold py-2">Nhắn tin Zalo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChiTietTinDang;