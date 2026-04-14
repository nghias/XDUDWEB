import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="text-light pt-5 pb-3 mt-auto" style={{ backgroundColor: '#1e293b' }}>
            <div className="container">
                <div className="row gy-4">
                    {/* Cột 1: Thông tin thương hiệu */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            {/* Tái sử dụng Logo SVG để đồng bộ nhận diện thương hiệu */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="36" height="36" className="flex-shrink-0">
                                <path d="M50 5 C30 5 15 20 15 40 C15 65 50 95 50 95 C50 95 85 65 85 40 C85 20 70 5 50 5 Z" fill="#0D8ABC" />
                                <circle cx="50" cy="38" r="22" fill="#ffffff" />
                                <path d="M50 22 L36 34 L40 34 L40 48 L46 48 L46 40 L54 40 L54 48 L60 48 L60 34 L64 34 Z" fill="#0D8ABC" />
                            </svg>
                            <h5 className="fw-bold mb-0 text-white">Tìm Trọ Trực Tuyến</h5>
                        </div>
                        <p className="text-white-50 small mb-4" style={{ lineHeight: '1.6' }}>
                            Nền tảng kết nối người thuê và người cho thuê phòng trọ, căn hộ nhanh chóng, an toàn và tiện lợi nhất. 
                            Chúng tôi mang đến giải pháp tìm kiếm chỗ ở thông minh cho hàng triệu sinh viên và người lao động.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white-50 text-decoration-none fs-5 hover-white"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="text-white-50 text-decoration-none fs-5 hover-white"><i className="bi bi-youtube"></i></a>
                            <a href="#" className="text-white-50 text-decoration-none fs-5 hover-white"><i className="bi bi-tiktok"></i></a>
                        </div>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div className="col-lg-4 col-md-6 ps-lg-5">
                        <h5 className="fw-bold mb-3 text-white">Liên kết nhanh</h5>
                        <ul className="list-unstyled d-flex flex-column gap-2 small">
                            <li>
                                <Link to="/" className="text-white-50 text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '10px' }}></i> Trang chủ
                                </Link>
                            </li>
                            <li>
                                <Link to="/search" className="text-white-50 text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '10px' }}></i> Tìm kiếm phòng trọ
                                </Link>
                            </li>
                            <li>
                                <Link to="/quan-ly-tin-dang" className="text-white-50 text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '10px' }}></i> Quản lý tin đăng
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-white-50 text-decoration-none hover-white">
                                    <i className="bi bi-chevron-right me-1" style={{ fontSize: '10px' }}></i> Hướng dẫn sử dụng
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Thông tin liên hệ */}
                    <div className="col-lg-4 col-md-12">
                        <h5 className="fw-bold mb-3 text-white">Thông tin liên hệ</h5>
                        <ul className="list-unstyled d-flex flex-column gap-3 small text-white-50">
                            <li className="d-flex align-items-start gap-2">
                                <i className="bi bi-geo-alt-fill mt-1" style={{ color: '#0D8ABC' }}></i>
                                <span>Khu vực TP. Hồ Chí Minh (Hỗ trợ toàn quốc)</span>
                            </li>
                            <li className="d-flex align-items-center gap-2">
                                <i className="bi bi-telephone-fill" style={{ color: '#0D8ABC' }}></i>
                                <span>0901 234 567</span>
                            </li>
                            <li className="d-flex align-items-center gap-2">
                                <i className="bi bi-envelope-fill" style={{ color: '#0D8ABC' }}></i>
                                <span>hotro@timtrotructuyen.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <hr className="my-4 border-secondary" style={{ opacity: 0.2 }} />

                {/* Phần Copyright */}
                <div className="text-center text-white-50 small pb-2">
                    &copy; {new Date().getFullYear()} Bản quyền thuộc về <strong>Tìm Trọ Trực Tuyến</strong>. Tất cả các quyền được bảo lưu.
                </div>
            </div>

            {/* Thêm CSS cho hiệu ứng hover sáng lên chữ trắng */}
            <style>{`
                .hover-white {
                    transition: color 0.3s ease;
                }
                .hover-white:hover {
                    color: #ffffff !important;
                }
            `}</style>
        </footer>
    );
};

export default Footer;