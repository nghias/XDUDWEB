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
    <header className="sticky-top shadow-sm bg-white border-bottom" style={{ zIndex: 2000 }}>
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          
          {/* LOGO SVG (Bên trái) */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 mb-0 text-decoration-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40" className="flex-shrink-0">
              <path d="M50 5 C30 5 15 20 15 40 C15 65 50 95 50 95 C50 95 85 65 85 40 C85 20 70 5 50 5 Z" fill="#0D8ABC" />
              <circle cx="50" cy="38" r="22" fill="#ffffff" />
              <path d="M50 22 L36 34 L40 34 L40 48 L46 48 L46 40 L54 40 L54 48 L60 48 L60 34 L64 34 Z" fill="#0D8ABC" />
              <circle cx="50" cy="38" r="6" fill="none" stroke="#FF8C00" strokeWidth="2.5" />
              <line x1="54" y1="42" x2="58" y2="46" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="fw-bold text-primary d-none d-md-block">Tìm Trọ Trực Tuyến</span>
          </Link>

          {/* MENU & THÔNG TIN USER (Bên phải) */}
          <div className="d-flex align-items-center gap-3">
            <ul className="navbar-nav d-none d-lg-flex flex-row gap-4 me-3 mb-0 align-items-center">
              
              {/* XEM TIN ĐĂNG: Mọi quyền đều xem được */}
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-primary" to="/">
                  <i className="bi bi-house-door me-1"></i> Tìm trọ
                </Link>
              </li>

              {/* QUẢN LÝ TIN ĐĂNG: Chỉ hiện với Chủ nhà hoặc Admin */}
              {(userData?.vai_tro === 'chu_nha' || userData?.vai_tro === 'quan_tri') && (
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-primary" to="/quan-ly-tin-dang">
                    <i className="bi bi-list-task me-1"></i> Quản lý tin đăng
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark" to="">
                  Chức Năng Tạm
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-semibold text-dark" to="">
                  Chức Năng Tạm
                </Link>
              </li>
            </ul>

            {/* AVATAR & DROPDOWN */}
            <div ref={dropdownRef}>
              {userData ? (
                <div className="dropdown">
                  <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <span className="d-none d-xl-block fw-medium">{userData.ho_ten}</span>
                    <img src={userData.anh_dai_dien || defaultAvatar} alt="Avatar" className="rounded-circle border" width="40" height="40" style={{ objectFit: "cover" }} />
                  </div>

                  {isDropdownOpen && (
                    <ul className="dropdown-menu dropdown-menu-end show shadow-lg border" style={{ position: "absolute", top: "100%", right: "0", marginTop: "10px", zIndex: 3000, minWidth: "200px" }}>
                      <li><Link className="dropdown-item py-2" to="/profile">Thông tin cá nhân</Link></li>
                      <li><Link className="dropdown-item py-2" to="/forgot-password">Quên mật khẩu</Link></li>
                      <li><Link className="dropdown-item py-2" to="/change-password">Đổi mật khẩu</Link></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger fw-bold py-2" onClick={handleLogout} disabled={isLoggingOut}>
                          {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary fw-medium px-4 text-nowrap" style={{ borderRadius: "8px" }}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;