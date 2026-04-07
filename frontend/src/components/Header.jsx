import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react'; // Đã bỏ icon Home vì không cần thiết ở header một dòng nữa

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
        localStorage.removeItem('user_session'); 
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
        <header className="sticky-top shadow-sm bg-white border-bottom">
            <div className="container py-2">
                <div className="d-flex align-items-center justify-content-between">
                    
                    {/* --- 1. LOGO TRÁI --- */}
                    <Link to="/" className="navbar-brand d-flex align-items-center gap-2 mb-0 text-decoration-none">
                        <img src={logoUrl} alt="Logo" width="40" height="40" />
                        <span className="fw-bold text-primary d-none d-md-block">Tìm Trọ Trực Tuyến</span>
                    </Link>

                    {/* --- 2. THANH TÌM KIẾM Ở GIỮA --- */}
                    <div className="flex-grow-1 mx-3 mx-lg-4" style={{ maxWidth: '500px' }}>
                        <div className="bg-light rounded-pill px-3 py-2 d-flex align-items-center border">
                            <Search size={18} className="text-secondary me-2 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Tìm quận, tên đường..."
                                className="border-0 w-100 search-input bg-transparent"
                                style={{ boxShadow: 'none', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* --- 3. MENU VÀ USER PHẢI --- */}
                    <div className="d-flex align-items-center gap-3">
                        {/* Ẩn menu chữ trên màn hình nhỏ để tránh vỡ giao diện */}
                        <ul className="navbar-nav d-none d-lg-flex flex-row gap-4 me-2 mb-0">
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold text-dark" to="#">Chức năng 1</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold text-dark" to="#">Chức năng 2</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link fw-semibold text-dark" to="#">Chức năng 3</Link>
                            </li>
                        </ul>

                        {/* Kiểm tra User */}
                        <div ref={dropdownRef}>
                            {userData ? (
                                <div className="dropdown">
                                    <div 
                                        className="d-flex align-items-center gap-2" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span className="d-none d-xl-block fw-medium">{userData.ho_ten}</span>
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
                                <Link to="/login" className="btn btn-primary fw-medium px-4 text-nowrap" style={{ borderRadius: '8px' }}>
                                    Đăng nhập
                                </Link>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* CSS tùy chỉnh nhỏ cho input focus */}
            <style>{`
                .search-input:focus {
                    outline: none;
                }
            `}</style>

        </header>
    );
};

export default Header;