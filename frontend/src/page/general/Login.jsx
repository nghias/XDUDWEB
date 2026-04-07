import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link để chuyển trang
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State quản lý xem/ẩn mật khẩu
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const redirectByRole = (vaiTro) => {
        if (vaiTro === 'quan_tri') {
            navigate('/admin');
        } else if (vaiTro === 'chu_nha' || vaiTro === 'nguoi_tim_phong') {
            navigate('/user');
        } else {
            setError('Vai trò không hợp lệ!');
        }
    };

    useEffect(() => {
        const session = localStorage.getItem('user_session');
        if (session) {
            try {
                const userData = JSON.parse(session);
                redirectByRole(userData.vai_tro);
            } catch (e) {
                localStorage.removeItem('user_session');
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    mat_khau: matKhau 
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                localStorage.setItem('user_session', JSON.stringify(result.data));
                localStorage.setItem('auth_token', result.token);
                
                setSuccessMsg(result.message || 'Đăng nhập thành công!');
                
                setTimeout(() => {
                    redirectByRole(result.data.vai_tro);
                }, 1500);

            } else {
                if (response.status === 422 && result.errors) {
                    const firstErrorKey = Object.keys(result.errors)[0];
                    setError(result.errors[firstErrorKey][0]);
                } else {
                    setError(result.message || 'Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!');
                }
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng kiểm tra lại mạng hoặc thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-full-screen-container bg-light d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-sm border-0" style={{ width: '100%', maxWidth: '420px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-dark fw-bold">Đăng Nhập</h2>
                
                {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}
                {successMsg && <div className="alert alert-success text-center p-2 mb-3">{successMsg}</div>}

                <form onSubmit={handleLogin} className="d-flex flex-column">
                    {/* Input Email */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Tài khoản (Email):</label>
                        <input 
                            type="email" 
                            className="form-control py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập email của bạn"
                            disabled={isLoading || successMsg}
                        />
                    </div>

                    {/* Input Mật khẩu có nút Xem/Ẩn */}
                    <div className="mb-2">
                        <label className="form-label text-secondary fw-medium">Mật khẩu:</label>
                        <div className="input-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control py-2"
                                value={matKhau}
                                onChange={(e) => setMatKhau(e.target.value)}
                                required
                                placeholder="Nhập mật khẩu"
                                disabled={isLoading || successMsg}
                            />
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-3"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading || successMsg}
                                tabIndex="-1" // Không focus vào nút này khi bấm Tab
                            >
                                {/* Dùng icon Bootstrap để hiển thị mắt mở/đóng */}
                                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Quên mật khẩu */}
                    <div className="d-flex justify-content-end mb-4">
                        <Link to="/forgot-password" className="text-decoration-none text-primary small fw-medium">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    {/* Nút Đăng nhập */}
                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg} 
                        className={`btn w-100 fw-bold py-2 ${successMsg ? 'btn-success' : 'btn-primary'}`}
                        style={{ borderRadius: '8px' }}
                    >
                        {isLoading ? 'Đang xử lý...' : (successMsg ? 'Đang chuyển hướng...' : 'Đăng nhập')}
                    </button>

                    {/* Đăng ký */}
                    <div className="text-center mt-4 pt-3 border-top">
                        <span className="text-muted small">Bạn chưa có tài khoản? </span>
                        <Link to="/register" className="text-decoration-none text-primary fw-bold small">
                            Đăng ký ngay
                        </Link>
                    </div>

                    {/* Nút quay lại */}
                    <div className="text-center mt-4 pt-3 border-top">
                        <Link to="/" className="text-decoration-none text-secondary small fw-medium">
                            <i className="bi bi-arrow-left me-1"></i> Quay lại
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;