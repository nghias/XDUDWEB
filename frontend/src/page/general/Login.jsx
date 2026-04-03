import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [tenTK, setTenTK] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra session khi vừa mở trang (nếu đã đăng nhập thì tự động chuyển hướng)
    useEffect(() => {
        const session = localStorage.getItem('user_session');
        if (session) {
            const userData = JSON.parse(session);
            redirectByRole(userData.vai_tro);
        }
    }, [navigate]);

    // Hàm xử lý chuyển hướng dựa theo vai trò
    const redirectByRole = (vaiTro) => {
        switch (vaiTro) {
            case 'quan_tri':
                navigate('/admin');
                break;
            case 'chu_nha':
            case 'nguoi_tim_phong':
                navigate('/user');
                break;
            default:
                navigate('/login');
                break;
        }
    };

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
                // Gửi param TenTK và MatKhau như yêu cầu
                body: JSON.stringify({ TenTK: tenTK, MatKhau: matKhau })
            });

            const result = await response.json();

            if (result.success) {
                // Lưu object data vào localStorage
                localStorage.setItem('user_session', JSON.stringify(result.data));
                
                // Chuyển hướng đến trang thích hợp
                redirectByRole(result.data.vai_tro);
            } else {
                // Hiển thị lỗi từ server trả về
                setError(result.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Dùng Bootstrap để căn giữa toàn màn hình
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light w-100">
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

const styles = {
    container: { 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        width: '100vw', /* THÊM DÒNG NÀY ĐỂ MỞ RỘNG TOÀN MÀN HÌNH */
        backgroundColor: '#f3f4f6' 
    },
    // ... giữ nguyên các phần còn lại
};

export default Login;