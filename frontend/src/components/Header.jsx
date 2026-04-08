import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);

  // --- PHẦN CẬP NHẬT CHO THANH SEARCH VÀ GỢI Ý ---
  const [searchTerm, setSearchTerm] = useState(""); 
  const [suggestions, setSuggestions] = useState([]); // Lưu danh sách gợi ý
  const [allRooms, setAllRooms] = useState([]); // Lưu dữ liệu gốc từ API để lọc
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  // 1. Lấy dữ liệu từ API khi Header mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('https://xdudweb-php.onrender.com/api/tat-ca-tin-dang');
        const data = await response.json();
        setAllRooms(data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu gợi ý:", error);
      }
    };
    fetchRooms();
  }, []);

  // 2. Hàm xử lý khi gõ chữ
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      // Lọc các phòng có tiêu đề chứa từ khóa
      const filtered = allRooms.filter(room => 
        room.tieu_de.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Chỉ hiện tối đa 5 gợi ý
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      setShowSuggestions(false);
      navigate(`/search?tu_khoa=${encodeURIComponent(searchTerm)}`);
    }
  };

  // 3. Hàm khi click vào một dòng gợi ý
  const handleSelectSuggestion = (title) => {
    setSearchTerm(title);
    setShowSuggestions(false);
    navigate(`/search?tu_khoa=${encodeURIComponent(title)}`);
  };

  // Đóng gợi ý khi click ra ngoài thanh search
  useEffect(() => {
    const handleClickOutsideSearch = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSearch);
    return () => document.removeEventListener("mousedown", handleClickOutsideSearch);
  }, []);
  // ----------------------------------------------

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

  const logoUrl = "https://cdn-icons-png.flaticon.com/512/1946/1946436.png";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header className="sticky-top shadow-sm bg-white border-bottom">
      <div className="container py-2">
        <div className="d-flex align-items-center justify-content-between">
          {/* --- 1. LOGO TRÁI --- */}
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center gap-2 mb-0 text-decoration-none"
          >
            <img src={logoUrl} alt="Logo" width="40" height="40" />
            <span className="fw-bold text-primary d-none d-md-block">
              Tìm Trọ Trực Tuyến
            </span>
          </Link>

          {/* --- 2. THANH TÌM KIẾM Ở GIỮA (CẬP NHẬT GỢI Ý) --- */}
          <div
            className="flex-grow-1 mx-3 mx-lg-4 position-relative"
            style={{ maxWidth: "500px" }}
            ref={searchContainerRef}
          >
            <div className="bg-light rounded-pill px-3 py-2 d-flex align-items-center border">
              <Search size={18} className="text-secondary me-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Tìm quận, tên đường..."
                className="border-0 w-100 search-input bg-transparent"
                style={{ boxShadow: "none", outline: "none" }}
                value={searchTerm}
                onChange={handleInputChange} 
                onKeyDown={handleSearch}
                onFocus={() => searchTerm && setShowSuggestions(true)}
              />
            </div>

            {/* DANH SÁCH GỢI Ý */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="position-absolute w-100 bg-white mt-1 shadow-lg rounded-3 border list-unstyled py-2" 
                  style={{ zIndex: 1050, top: '100%' }}>
                {suggestions.map((room) => (
                  <li 
                    key={room.id} 
                    className="px-3 py-2 suggestion-item d-flex align-items-center gap-2"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectSuggestion(room.tieu_de)}
                  >
                    <Search size={14} className="text-muted" />
                    <span className="text-dark text-truncate">{room.tieu_de}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* --- 3. MENU VÀ USER PHẢI --- */}
          <div className="d-flex align-items-center gap-3">
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

            <div ref={dropdownRef}>
              {userData ? (
                <div className="dropdown">
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="d-none d-xl-block fw-medium">
                      {userData.ho_ten}
                    </span>
                    <img
                      src={userData.anh_dai_dien || defaultAvatar}
                      alt="Avatar"
                      className="rounded-circle border"
                      width="40"
                      height="40"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {isDropdownOpen && (
                    <ul
                      className="dropdown-menu dropdown-menu-end show shadow-sm"
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: "0",
                        marginTop: "10px",
                      }}
                    >
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
                          {isLoggingOut ? "Đang xử lý..." : "Đăng xuất"}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary fw-medium px-4 text-nowrap"
                  style={{ borderRadius: "8px" }}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .search-input {
            color: #000000 !important;
            font-size: 14px;
        }
        .search-input::placeholder {
            color: #6c757d !important;
            opacity: 1;
        }
        .search-input:focus {
            outline: none;
        }
        .suggestion-item:hover {
            background-color: #f8f9fa;
            color: #0d6efd !important;
        }
        .suggestion-item span:hover {
            color: #0d6efd;
        }
      `}</style>
    </header>
  );
};

export default Header;