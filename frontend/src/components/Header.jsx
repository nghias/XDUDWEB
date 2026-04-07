import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef(null);

    // Lấy thông tin user từ localStorage an toàn hơn
    let userData = null;
    try {
        const userSession = localStorage.getItem('user_session');
        if (userSession && userSession !== 'undefined') {
            userData = JSON.parse(userSession);
        }
    } catch (error) {
        console.error('Lỗi khi đọc dữ liệu user:', error);
        localStorage.removeItem('user_session'); // Xóa đi nếu dữ liệu bị lỗi
    }

    const defaultAvatar = userData?.ho_ten 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.ho_ten)}&background=0D8ABC&color=fff` 
        : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    const logoUrl = 'https://cdn-icons-png.flaticon.com/512/1946/1946436.png';

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const token = localStorage.getItem('auth_token');
        
        try {
            if (token) {
                await fetch('https://xdudweb-php.onrender.com/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    }
                });
            }
        } catch (error) {
            console.error("Lỗi khi gọi API đăng xuất:", error);
        } finally {
            localStorage.removeItem('user_session');
            localStorage.removeItem('auth_token');
            setIsLoggingOut(false);
            setIsDropdownOpen(false);
            alert('Đã đăng xuất thành công!');
            navigate('/login');
        }
    };

    return (
        <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div className="container">
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={logoUrl} alt="Logo" width="40" height="40" />
                    <span className="fw-bold text-primary">Tìm Trọ Trực Tuyến</span>
                </Link>

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

                <div className="d-flex align-items-center" ref={dropdownRef}>
                    {/* KIỂM TRA ĐĂNG NHẬP Ở ĐÂY */}
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
                            
                            {isDropdownOpen && (
                                <ul className="dropdown-menu dropdown-menu-end show shadow-sm" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px' }}>
                                    <li><Link className="dropdown-item" to="/profile">Thông tin cá nhân</Link></li>
                                    <li><Link className="dropdown-item" to="/forgot-password">Quên mật khẩu</Link></li>
                                    <li><Link className="dropdown-item" to="/change-password">Đổi mật khẩu</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button 
                                            className="dropdown-item text-danger fw-bold" 
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? 'Đang xử lý...' : 'Đăng xuất'}
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </div>
                    ) : (
                        // NẾU CHƯA ĐĂNG NHẬP SẼ HIỆN NÚT NÀY
                        <Link to="/login" className="btn btn-primary fw-medium px-4" style={{ borderRadius: '8px' }}>
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;