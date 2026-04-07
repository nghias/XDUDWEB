import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Dùng chung file CSS với trang Login để đồng bộ giao diện

const Register = () => {
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [matKhau, setMatKhau] = useState('');
    const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
    
    // State quản lý ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Kiểm tra frontend: Mật khẩu xác nhận phải khớp
        if (matKhau !== xacNhanMatKhau) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Kiểm tra frontend: Số điện thoại
        if (soDienThoai.length > 10) {
            setError('Số điện thoại không được vượt quá 10 số!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    ho_ten: hoTen,
                    email: email, 
                    so_dien_thoai: soDienThoai,
                    mat_khau: matKhau 
                })
            });

            const result = await response.json();

            // HTTP 201 Created là mã thành công từ hàm create() của Laravel
            if (response.ok || response.status === 201) {
                setSuccessMsg(result.message || 'Đăng ký tài khoản thành công!');
                
                // Chuyển hướng về trang đăng nhập sau 2 giây
                setTimeout(() => {
                    navigate('/login');
                }, 2000);

            } else {
                // Bắt lỗi Validation từ Laravel (HTTP 422)
                if (response.status === 422 && result.errors) {
                    const firstErrorKey = Object.keys(result.errors)[0];
                    setError(result.errors[firstErrorKey][0]); // Hiển thị lỗi đầu tiên (ví dụ: trùng email)
                } else {
                    setError(result.message || 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại!');
                }
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng kiểm tra lại mạng hoặc thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-full-screen-container bg-light d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card p-4 shadow-sm border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-dark fw-bold">Đăng Ký</h2>
                
                {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}
                {successMsg && <div className="alert alert-success text-center p-2 mb-3">{successMsg}</div>}

                <form onSubmit={handleRegister} className="d-flex flex-column">
                    {/* Input Họ Tên */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Họ và tên <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            className="form-control py-2"
                            value={hoTen}
                            onChange={(e) => setHoTen(e.target.value)}
                            required
                            placeholder="Nhập họ và tên của bạn"
                            disabled={isLoading || successMsg}
                        />
                    </div>

                    {/* Input Email */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Email <span className="text-danger">*</span></label>
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

                    {/* Input Số điện thoại */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Số điện thoại <span className="text-danger">*</span></label>
                        <input 
                            type="tel" 
                            className="form-control py-2"
                            value={soDienThoai}
                            onChange={(e) => setSoDienThoai(e.target.value.replace(/\D/g, ''))} // Chỉ cho phép nhập số
                            required
                            maxLength="10"
                            placeholder="Nhập số điện thoại (tối đa 10 số)"
                            disabled={isLoading || successMsg}
                        />
                    </div>

                    {/* Input Mật khẩu */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Mật khẩu <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control py-2"
                                value={matKhau}
                                onChange={(e) => setMatKhau(e.target.value)}
                                required
                                minLength="8"
                                placeholder="Ít nhất 8 ký tự"
                                disabled={isLoading || successMsg}
                            />
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-3"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading || successMsg}
                                tabIndex="-1"
                            >
                                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Input Xác nhận mật khẩu */}
                    <div className="mb-4">
                        <label className="form-label text-secondary fw-medium">Xác nhận mật khẩu <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="form-control py-2"
                                value={xacNhanMatKhau}
                                onChange={(e) => setXacNhanMatKhau(e.target.value)}
                                required
                                minLength="8"
                                placeholder="Nhập lại mật khẩu"
                                disabled={isLoading || successMsg}
                            />
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-3"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading || successMsg}
                                tabIndex="-1"
                            >
                                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Nút Đăng ký */}
                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg} 
                        className={`btn w-100 fw-bold py-2 ${successMsg ? 'btn-success' : 'btn-primary'}`}
                        style={{ borderRadius: '8px' }}
                    >
                        {isLoading ? 'Đang xử lý...' : (successMsg ? 'Đang chuyển hướng...' : 'Đăng ký')}
                    </button>

                    {/* Link về Đăng nhập */}
                    <div className="text-center mt-4 pt-3 border-top">
                        <span className="text-muted small">Bạn đã có tài khoản? </span>
                        <Link to="/login" className="text-decoration-none text-primary fw-bold small">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;