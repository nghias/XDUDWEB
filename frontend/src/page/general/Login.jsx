import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
    // Đổi tên state thành email để khớp 100% với backend
    const [email, setEmail] = useState(''); 
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState(''); // Thêm state quản lý thông báo thành công
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
                    'Accept': 'application/json' // Giúp Laravel biết đây là API để trả về JSON khi có lỗi validate
                },
                // Gửi đúng key 'email' và 'mat_khau' mà backend đang đọc
                body: JSON.stringify({ 
                    email: email, 
                    mat_khau: matKhau 
                })
            });

            const result = await response.json();

            // Nếu HTTP status trả về là ok (200) và success = true
            if (response.ok && result.success) {
                localStorage.setItem('user_session', JSON.stringify(result.data));
                localStorage.setItem('auth_token', result.token); // Lưu token như backend đã tạo
                
                // Hiển thị thông báo thành công từ backend
                setSuccessMsg(result.message); 
                
                // Dừng 1.5 giây cho người dùng thấy thông báo rồi mới chuyển trang
                setTimeout(() => {
                    redirectByRole(result.data.vai_tro);
                }, 1500);

            } else {
                // Xử lý các trường hợp thất bại
                if (response.status === 422) {
                    // Lỗi Validate do Laravel tự sinh ra (chưa nhập email, pass quá ngắn...)
                    const firstErrorKey = Object.keys(result.errors)[0];
                    setError(result.errors[firstErrorKey][0]);
                } else {
                    // Lỗi do backend tự định nghĩa (Sai email/pass, Tài khoản bị khóa)
                    setError(result.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
                }
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng kiểm tra lại mạng hoặc thử lại sau.');
            console.error("Login Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-full-screen-container">
            <div className="card p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }}>
                <h2 className="text-center mb-4 text-dark">Đăng Nhập</h2>
                
                {/* Khu vực hiển thị thông báo */}
                {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}
                {successMsg && <div className="alert alert-success text-center p-2 mb-3">{successMsg}</div>}

                <form onSubmit={handleLogin} className="d-flex flex-column">
                    <div className="mb-3">
                        <label className="form-label">Tài khoản (Email):</label>
                        <input 
                            type="email" 
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Nhập email của bạn"
                            disabled={isLoading || successMsg} // Khóa input khi đang xử lý hoặc đã thành công
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
                            disabled={isLoading || successMsg} 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg} 
                        className={`btn w-100 fw-bold py-2 ${successMsg ? 'btn-success' : 'btn-primary'}`}
                    >
                        {isLoading ? 'Đang xử lý...' : (successMsg ? 'Đang chuyển hướng...' : 'Đăng nhập')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;