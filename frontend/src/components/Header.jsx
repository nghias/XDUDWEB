import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Lấy thông tin user từ localStorage
    const userSession = localStorage.getItem('user_session');
    const userData = userSession ? JSON.parse(userSession) : null;

    // Ảnh mặc định (Nếu null, tự tạo ảnh có chữ cái đầu của tên, hoặc dùng 1 icon mặc định)
    const defaultAvatar = userData?.ho_ten 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.ho_ten)}&background=0D8ABC&color=fff` 
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; // Ảnh user xám mặc định

    // Link logo mặc định (Icon ngôi nhà)
    const logoUrl = 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png';

    // Xử lý click ra ngoài để đóng dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Hàm xử lý đăng xuất
    const handleLogout = async () => {
        const token = localStorage.getItem('auth_token');
        
        // 1. Gọi API Backend để hủy token Sanctum (như trong ảnh bạn cung cấp)
        if (token) {
            try {
                await fetch('https://xdudweb-php.onrender.com/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
            } catch (error) {
                console.error("Lỗi khi gọi API đăng xuất:", error);
            }
        }

        // 2. Xóa sạch LocalStorage / Session
        localStorage.removeItem('user_session');
        localStorage.removeItem('auth_token');

        // 3. Thông báo và chuyển hướng
        alert('Đã đăng xuất thành công và hủy Token!');
        navigate('/login');
    };

    return (
        <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                {/* BÊN TRÁI: Logo */}
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={logoUrl} alt="Logo" width="40" height="40" />
                    <span className="fw-bold text-primary">Tìm Trọ Trực Tuyến</span>
                </Link>

                {/* GIỮA: Các chức năng (tạm thời) */}
                <div className="collapse navbar-collapse justify-content-center">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="#">Chức năng 1</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="#">Chức năng 2</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link fw-semibold" to="#">Chức năng 3</Link>
                        </li>
                    </ul>
                </div>

                {/* BÊN PHẢI: Avatar và Dropdown */}
                <div className="d-flex align-items-center" ref={dropdownRef}>
                    {userData ? (
                        <div className="dropdown">
                            <div 
                                className="d-flex align-items-center gap-2" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="d-none d-md-block fw-medium">{userData.ho_ten}</span>
                                <img 
                                    src={userData.anh_dai_dien || defaultAvatar} 
                                    alt="Avatar" 
                                    className="rounded-circle border"
                                    width="40" 
                                    height="40"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            
                            {/* Menu Dropdown */}
                            {isDropdownOpen && (
                                <ul className="dropdown-menu dropdown-menu-end show shadow-sm" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px' }}>
                                    <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                                    <li><Link className="dropdown-item" to="/forgot-password">Quên mật khẩu</Link></li>
                                    <li><Link className="dropdown-item" to="/change-password">Đổi mật khẩu</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger fw-bold" onClick={handleLogout}>
                                            Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-outline-primary">Đăng nhập</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;