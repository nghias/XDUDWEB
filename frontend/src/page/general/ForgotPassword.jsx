import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Dùng chung CSS để đồng bộ giao diện

const ForgotPassword = () => {
    // Quản lý các bước: 1 = Nhập Email, 2 = Nhập Token & Mật khẩu mới
    const [step, setStep] = useState(1); 

    // Các state lưu trữ dữ liệu
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [matKhauMoi, setMatKhauMoi] = useState('');
    const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');

    // State ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State trạng thái
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // HÀM XỬ LÝ BƯỚC 1: GỬI YÊU CẦU QUÊN MẬT KHẨU
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMsg('Mã xác nhận đã được gửi đến email của bạn!');
                // Đợi 1.5s rồi chuyển sang bước 2 để người dùng đọc thông báo
                setTimeout(() => {
                    setSuccessMsg('');
                    setStep(2);
                }, 1500);
            } else {
                setError(result.message || 'Không tìm thấy tài khoản với email này.');
            }
        } catch (err) {
            setError('Lỗi kết nối server. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    // HÀM XỬ LÝ BƯỚC 2: CẬP NHẬT MẬT KHẨU MỚI
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Kiểm tra khớp mật khẩu
        if (matKhauMoi !== xacNhanMatKhau) {
            setError('Xác nhận mật khẩu không khớp!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                // Dữ liệu bám sát theo hàm resetPassword trong Controller của bạn
                body: JSON.stringify({ 
                    email: email, 
                    token: token, 
                    mat_khau_moi: matKhauMoi 
                })
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMsg(result.message || 'Cập nhật mật khẩu thành công!');
                // Thành công thì cho quay về trang đăng nhập
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Xử lý lỗi 400 (Sai token/Hết hạn) hoặc 422 (Lỗi validate)
                setError(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } catch (err) {
            setError('Lỗi kết nối server. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-full-screen-container bg-light d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card p-4 shadow-sm border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-2 text-dark fw-bold">
                    {step === 1 ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}
                </h2>
                
                <p className="text-center text-muted small mb-4">
                    {step === 1 
                        ? 'Vui lòng nhập email bạn đã đăng ký. Chúng tôi sẽ gửi mã xác nhận để đặt lại mật khẩu.' 
                        : `Vui lòng nhập mã xác nhận đã được gửi đến email ${email} của bạn.`}
                </p>
                
                {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}
                {successMsg && <div className="alert alert-success text-center p-2 mb-3">{successMsg}</div>}

                {/* --- UI BƯỚC 1 --- */}
                {step === 1 && (
                    <form onSubmit={handleSendCode} className="d-flex flex-column">
                        <div className="mb-4">
                            <label className="form-label text-secondary fw-medium">Email đã đăng ký</label>
                            <input 
                                type="email" 
                                className="form-control py-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Ví dụ: nguyenvan_a@gmail.com"
                                disabled={isLoading || successMsg}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || successMsg} 
                            className={`btn w-100 fw-bold py-2 ${successMsg ? 'btn-success' : 'btn-primary'}`}
                            style={{ borderRadius: '8px' }}
                        >
                            {isLoading ? 'Đang gửi...' : 'Gửi mã xác nhận'}
                        </button>
                    </form>
                )}

                {/* --- UI BƯỚC 2 --- */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="d-flex flex-column">
                        <div className="mb-3">
                            <label className="form-label text-secondary fw-medium">Mã xác nhận (Token)</label>
                            <input 
                                type="text" 
                                className="form-control py-2 text-center fw-bold text-primary"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                                placeholder="Nhập mã xác nhận"
                                disabled={isLoading || successMsg}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-secondary fw-medium">Mật khẩu mới</label>
                            <div className="input-group">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-control py-2"
                                    value={matKhauMoi}
                                    onChange={(e) => setMatKhauMoi(e.target.value)}
                                    required
                                    minLength="8"
                                    placeholder="Tối thiểu 8 ký tự"
                                    disabled={isLoading || successMsg}
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-secondary fw-medium">Xác nhận mật khẩu mới</label>
                            <div className="input-group">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    className="form-control py-2"
                                    value={xacNhanMatKhau}
                                    onChange={(e) => setXacNhanMatKhau(e.target.value)}
                                    required
                                    minLength="8"
                                    placeholder="Nhập lại mật khẩu mới"
                                    disabled={isLoading || successMsg}
                                />
                                <button 
                                    type="button" 
                                    className="btn btn-outline-secondary px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    tabIndex="-1"
                                >
                                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading || successMsg} 
                            className={`btn w-100 fw-bold py-2 ${successMsg ? 'btn-success' : 'btn-primary'}`}
                            style={{ borderRadius: '8px' }}
                        >
                            {isLoading ? 'Đang xử lý...' : (successMsg ? 'Đang chuyển hướng...' : 'Cập nhật mật khẩu')}
                        </button>

                        <div className="text-center mt-3">
                            <button 
                                type="button" 
                                onClick={() => setStep(1)} 
                                className="btn btn-link text-decoration-none small text-muted"
                                disabled={isLoading || successMsg}
                            >
                                Gửi lại mã khác
                            </button>
                        </div>
                    </form>
                )}

                {/* Về trang đăng nhập */}
                <div className="text-center mt-4 pt-3 border-top">
                    <Link to="/login" className="text-decoration-none text-secondary small fw-medium">
                        <i className="bi bi-arrow-left me-1"></i> Quay lại
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;