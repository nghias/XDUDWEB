import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Nhập file CSS tùy chỉnh

const Login = () => {
    const [tenTK, setTenTK] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Hàm xử lý chuyển hướng dựa theo vai trò
    const redirectByRole = (vaiTro) => {
        if (vaiTro === 'quan_tri') {
            navigate('/admin');
        } else if (vaiTro === 'chu_nha' || vaiTro === 'nguoi_tim_phong') {
            navigate('/user');
        } else {
            // Nếu có role khác không xác định, có thể cho về trang chủ mặc định hoặc báo lỗi
            setError('Vai trò không hợp lệ!');
        }
    };

    // Kiểm tra session khi vừa mở trang (nếu đã đăng nhập thì tự động chuyển hướng, không cần đăng nhập lại)
    useEffect(() => {
        const session = localStorage.getItem('user_session');
        if (session) {
            try {
                const userData = JSON.parse(session);
                redirectByRole(userData.vai_tro);
            } catch (e) {
                // Xử lý trường hợp data trong localStorage bị lỗi format
                localStorage.removeItem('user_session');
            }
        }
    }, [navigate]);

    // Xử lý submit form
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Gửi param TenTK và MatKhau đến server
                body: JSON.stringify({ TenTK: tenTK, MatKhau: matKhau })
            });

            const result = await response.json();

            if (result.success) {
                // Đăng nhập đúng: Lưu object data vào localStorage
                localStorage.setItem('user_session', JSON.stringify(result.data));
                
                // Chuyển hướng đến trang thích hợp
                redirectByRole(result.data.vai_tro);
            } else {
                // Đăng nhập sai: Hiển thị lỗi từ server trả về
                setError(result.message || 'Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!');
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng kiểm tra lại mạng hoặc thử lại sau.');
            console.error("Login Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Sử dụng class CSS tùy chỉnh để căn giữa triệt để
        <div className="login-full-screen-container">
            {/* Thẻ card và form sử dụng các class Bootstrap như cũ để tận dụng kiểu dáng */}
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}>
                <h2 className="text-center mb-4 text-dark">Đăng Nhập</h2>
                
                {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}

                <form onSubmit={handleLogin} className="d-flex flex-column">
                    <div className="mb-3">
                        <label className="form-label">Tài khoản (Email):</label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={tenTK}
                            onChange={(e) => setTenTK(e.target.value)}
                            required
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Mật khẩu:</label>
                        <input 
                            type="password" 
                            className="form-control"
                            value={matKhau}
                            onChange={(e) => setMatKhau(e.target.value)}
                            required
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button type="submit" disabled={isLoading} className="btn btn-primary w-100 fw-bold py-2">
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;