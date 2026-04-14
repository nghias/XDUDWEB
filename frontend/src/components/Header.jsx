import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  // Lấy dữ liệu user từ localStorage
  let userData = null;
  try {
    const userSession = localStorage.getItem("user_session");
    if (userSession && userSession !== "undefined") {
      userData = JSON.parse(userSession);
    }
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu user:", error);
    localStorage.removeItem("user_session");
  }

  const defaultAvatar = userData?.ho_ten
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.ho_ten)}&background=0D8ABC&color=fff`
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý Đăng xuất
  const handleLogout = async () => {
    setIsLoggingOut(true);
    const token = localStorage.getItem("auth_token");
    try {
      if (token) {
        await fetch("https://xdudweb-php.onrender.com/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      localStorage.removeItem("user_session");
      localStorage.removeItem("auth_token");
      setIsLoggingOut(false);
      setIsDropdownOpen(false);
      alert("Đã đăng xuất thành công!");
      navigate("/login");
    }
  };

  return (
    <header className="sticky-top border-bottom glass-header" style={{ zIndex: 2000 }}>
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* 1. KHU VỰC TRÁI: LOGO */}
          <div className="header-left" style={{ flex: 1 }}>
            <Link to="/" className="navbar-brand d-flex align-items-center gap-2 mb-0 text-decoration-none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" className="flex-shrink-0">
                <path d="M50 5 C30 5 15 20 15 40 C15 65 50 95 50 95 C50 95 85 65 85 40 C85 20 70 5 50 5 Z" fill="#0D8ABC" />
                <circle cx="50" cy="38" r="22" fill="#ffffff" />
                <path d="M50 22 L36 34 L40 34 L40 48 L46 48 L46 40 L54 40 L54 48 L60 48 L60 34 L64 34 Z" fill="#0D8ABC" />
                <circle cx="50" cy="38" r="6" fill="none" stroke="#FF8C00" strokeWidth="2.5" />
                <line x1="54" y1="42" x2="58" y2="46" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="fw-bolder fs-5 text-primary d-none d-xl-block">Tìm Trọ Trực Tuyến</span>
            </Link>
          </div>

          {/* 2. KHU VỰC GIỮA: MENU ĐIỀU HƯỚNG */}
          <div className="header-center d-none d-lg-flex justify-content-center" style={{ flex: 2 }}>
            <ul className="navbar-nav flex-row gap-4 mb-0 align-items-center">
              <li className="nav-item">
                <Link className="nav-link custom-nav-link text-dark fw-medium" to="/">
                  <i className="bi bi-house-door me-1"></i> Trang chủ
                </Link>
              </li>
              
              {/* QUẢN LÝ TIN ĐĂNG: Chỉ hiện với Chủ nhà hoặc Admin */}
              {(userData?.vai_tro === 'chu_nha' || userData?.vai_tro === 'quan_tri') && (
                <li className="nav-item">
                  <Link className="nav-link custom-nav-link text-primary fw-medium" to="/quan-ly-tin-dang">
                    <i className="bi bi-list-task me-1"></i> Quản lý tin
                  </Link>
                </li>
              )}
              
              <li className="nav-item">
                <Link className="nav-link custom-nav-link text-dark fw-medium" to="">
                  <i className="bi bi-compass me-1"></i> Chức năng tạm
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link custom-nav-link text-dark fw-medium" to="">
                  <i className="bi bi-journal-text me-1"></i> Chức năng tạm
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. KHU VỰC PHẢI: USER / LOGIN */}
          <div className="header-right d-flex justify-content-end" style={{ flex: 1 }} ref={dropdownRef}>
            {userData ? (
              <div className="dropdown position-relative">
                <div 
                  className="user-dropdown-toggle d-flex align-items-center gap-2" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="text-end d-none d-sm-block">
                    <div className="fw-bold text-dark" style={{ fontSize: "14px", lineHeight: "1.2" }}>
                      {userData.ho_ten}
                    </div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>
                      {userData.vai_tro === 'chu_nha' ? 'Chủ nhà' : userData.vai_tro === 'quan_tri' ? 'Quản trị viên' : 'Thành viên'}
                    </div>
                  </div>
                  <img 
                    src={userData.anh_dai_dien || defaultAvatar} 
                    alt="Avatar" 
                    className="rounded-circle border border-2 border-white shadow-sm" 
                    width="42" height="42" style={{ objectFit: "cover" }} 
                  />
                  <i className="bi bi-chevron-down text-muted small ms-1 d-none d-sm-block"></i>
                </div>

                {/* MENU DROPDOWN */}
                {isDropdownOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show shadow-lg border-0 rounded-3 mt-2" style={{ position: "absolute", top: "100%", right: "0", zIndex: 3000, minWidth: "220px" }}>
                    <div className="px-3 py-2 border-bottom mb-2 bg-light rounded-top-3">
                      <p className="mb-0 small text-muted">Đăng nhập với email:</p>
                      <p className="mb-0 fw-medium text-truncate">{userData.email}</p>
                    </div>
                    <li><Link className="dropdown-item py-2 dropdown-item-custom" to="/profile"><i className="bi bi-person me-2 text-secondary"></i> Thông tin cá nhân</Link></li>
                    <li><Link className="dropdown-item py-2 dropdown-item-custom" to="/forgot-password"><i className="bi bi-shield-lock me-2 text-secondary"></i> Quên mật khẩu</Link></li>
                    <li><Link className="dropdown-item py-2 dropdown-item-custom" to="/change-password"><i className="bi bi-key me-2 text-secondary"></i> Đổi mật khẩu</Link></li>
                    <li><hr className="dropdown-divider my-2" /></li>
                    <li>
                      <button className="dropdown-item text-danger fw-bold py-2 dropdown-item-custom" onClick={handleLogout} disabled={isLoggingOut}>
                        <i className="bi bi-box-arrow-right me-2"></i> {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary fw-medium px-4 text-nowrap shadow-sm" style={{ borderRadius: "8px" }}>
                Đăng nhập
              </Link>
            )}
          </div>
          
        </div>
      </div>

      {/* STYLE TÙY CHỈNH CHO HEADER */}
      <style>{`
        /* Hiệu ứng kính mờ (Glassmorphism) */
        .glass-header {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Hiệu ứng gạch chân mượt mà cho Menu */
        .custom-nav-link {
          position: relative;
          padding: 0.5rem 0 !important;
          color: #4b5563 !important;
          transition: color 0.3s ease;
        }
        .custom-nav-link:hover {
          color: #0D8ABC !important;
        }
        .custom-nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: #0D8ABC;
          transition: width 0.3s ease;
        }
        .custom-nav-link:hover::after {
          width: 100%;
        }

        /* Hiệu ứng cho User Avatar */
        .user-dropdown-toggle {
          cursor: pointer;
          padding: 4px 12px 4px 16px;
          border-radius: 50px;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }
        .user-dropdown-toggle:hover {
          background-color: #f3f4f6;
          border-color: #e5e7eb;
        }

        /* Hover đẹp cho Dropdown Menu */
        .dropdown-item-custom {
          transition: all 0.2s;
        }
        .dropdown-item-custom:hover {
          background-color: #f8f9fa;
          padding-left: 1.5rem !important; /* Dịch nhẹ chữ sang phải khi hover */
        }
      `}</style>
    </header>
  );
};

export default Header;