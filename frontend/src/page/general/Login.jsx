import React, { useState } from 'react';
import './Login.css'; // Nhập file CSS tùy chỉnh mới tạo

const Login = () => {
    const [tenTK, setTenTK] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // ... (giữ nguyên logic useEffect và redirectByRole từ code trước)

    const handleLogin = async (e) => {
        // ... (giữ nguyên logic xử lý đăng nhập từ code trước)
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