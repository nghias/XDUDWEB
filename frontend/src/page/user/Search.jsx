import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Navigation, Loader2, ArrowRight } from "lucide-react";

const Search = () => {
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("tu_khoa") || ""; 

    // Hàm lấy ảnh demo giống bên Home
    const getMockImage = (id) => {
        return `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=500&auto=format&fit=crop&sig=${id}`;
    };

    useEffect(() => {
        const fetchDataAndFilter = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://xdudweb-php.onrender.com/api/tat-ca-tin-dang`);
                const data = response.data;

                if (keyword.trim() !== "") {
                    const searchLower = keyword.toLowerCase();
                    const filtered = data.filter(room => 
                        room.tieu_de.toLowerCase().includes(searchLower) || 
                        (room.mo_ta && room.mo_ta.toLowerCase().includes(searchLower))
                    );
                    setFilteredResults(filtered);
                } else {
                    setFilteredResults(data);
                }
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataAndFilter();
    }, [keyword]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
            <Loader2 className="animate-spin text-primary mb-2" size={40} />
            <p className="text-muted fw-medium">Đang tìm kiếm dữ liệu...</p>
        </div>
    );

    return (
        <div className="container mt-4 pb-5">
            <header className="mb-4 d-flex align-items-center gap-2">
                <Navigation size={22} className="text-primary" />
                <h3 className="h5 fw-bold m-0">
                    {keyword ? `Kết quả cho: "${keyword}"` : "Tất cả phòng trọ"}
                </h3>
            </header>

            <div className="row g-4">
                {filteredResults.length > 0 ? (
                    filteredResults.map((room) => (
                        <div key={room.id} className="col-12 col-md-6 col-lg-4">
                            {/* --- CẤU TRÚC CARD GIỐNG HỆT HOME --- */}
                            <Link to={`/chi-tiet-tin-dang/${room.id}`} className="text-decoration-none">
                                <article className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden custom-card-hover">
                                    <div style={{ height: '200px', backgroundColor: '#e9ecef' }}>
                                        <img
                                            src={getMockImage(room.id)} 
                                            alt="Demo"
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
                                            {/* NÚT BUTTON ĐÃ QUAY TRỞ LẠI */}
                                            <button className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1 fw-medium">
                                                Chi tiết <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5 w-100">
                        <p className="text-muted fs-5">Không tìm thấy phòng nào khớp với "{keyword}"</p>
                        <Link to="/" className="btn btn-primary rounded-pill">Quay lại trang chủ</Link>
                    </div>
                )}
            </div>

            <style>{`
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .custom-card-hover { transition: all 0.3s ease; }
                .custom-card-hover:hover { transform: translateY(-8px); }
            `}</style>
        </div>
    );
};

export default Search;