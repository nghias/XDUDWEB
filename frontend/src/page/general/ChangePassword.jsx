import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ChangePassword = () => {
    const [matKhauCu, setMatKhauCu] = useState('');
    const [matKhauMoi, setMatKhauMoi] = useState('');
    const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');

    // State ẩn/hiện mật khẩu cho từng ô
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // 1. Kiểm tra xác nhận mật khẩu mới ở frontend
        if (matKhauMoi !== xacNhanMatKhau) {
            setError('Xác nhận mật khẩu mới không khớp!');
            return;
        }

        // 2. Lấy token để chứng minh đã đăng nhập
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setError('Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('https://xdudweb-php.onrender.com/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ VƯỢT QUA SANCTUM
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ 
                    mat_khau_cu: matKhauCu, 
                    mat_khau_moi: matKhauMoi 
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSuccessMsg(result.message || 'Đổi mật khẩu thành công!');
                
                // Xóa form sau khi đổi thành công
                setMatKhauCu('');
                setMatKhauMoi('');
                setXacNhanMatKhau('');

                // Tùy chọn: Chuyển hướng về trang chủ sau 2 giây
                setTimeout(() => {
                    navigate('/');
                }, 2000);

            } else {
                // Xử lý lỗi 422 (Validate) hoặc 400 (Sai mật khẩu cũ)
                if (response.status === 422 && result.errors) {
                    const firstErrorKey = Object.keys(result.errors)[0];
                    setError(result.errors[firstErrorKey][0]);
                } else {
                    setError(result.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!');
                }
            }
        } catch (err) {
            setError('Lỗi kết nối đến server. Vui lòng kiểm tra lại mạng.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-light d-flex justify-content-center align-items-center min-vh-100 py-5">
            <div className="card p-4 shadow-sm border-0" style={{ width: '100%', maxWidth: '450px', borderRadius: '12px' }}>
                <h2 className="text-center mb-4 text-dark fw-bold">Đổi Mật Khẩu</h2>
                
                {error && <div className="alert alert-danger text-center p-2 mb-3">{error}</div>}
                {successMsg && <div className="alert alert-success text-center p-2 mb-3">{successMsg}</div>}

                <form onSubmit={handleChangePassword} className="d-flex flex-column">
                    {/* Mật khẩu cũ */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Mật khẩu cũ <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input 
                                type={showOld ? "text" : "password"} 
                                className="form-control py-2"
                                value={matKhauCu}
                                onChange={(e) => setMatKhauCu(e.target.value)}
                                required
                                placeholder="Nhập mật khẩu hiện tại"
                                disabled={isLoading || successMsg}
                            />
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-3"
                                onClick={() => setShowOld(!showOld)}
                                disabled={isLoading || successMsg}
                                tabIndex="-1"
                            >
                                <i className={`bi ${showOld ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="mb-3">
                        <label className="form-label text-secondary fw-medium">Mật khẩu mới <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input 
                                type={showNew ? "text" : "password"} 
                                className="form-control py-2"
                                value={matKhauMoi}
                                onChange={(e) => setMatKhauMoi(e.target.value)}
                                required
                                minLength="8"
                                placeholder="Ít nhất 8 ký tự"
                                disabled={isLoading || successMsg}
                            />
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary px-3"
                                onClick={() => setShowNew(!showNew)}
                                disabled={isLoading || successMsg}
                                tabIndex="-1"
                            >
                                <i className={`bi ${showNew ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Xác nhận mật khẩu mới */}
                    <div className="mb-4">
                        <label className="form-label text-secondary fw-medium">Xác nhận mật khẩu mới <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input 
                                type={showConfirm ? "text" : "password"} 
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
                                onClick={() => setShowConfirm(!showConfirm)}
                                disabled={isLoading || successMsg}
                                tabIndex="-1"
                            >
                                <i className={`bi ${showConfirm ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Nút Đổi mật khẩu */}
                    <button 
                        type="submit" 
                        disabled={isLoading || successMsg} 
                        className={`btn w-100 fw-bold py-2 ${successMsg ? 'btn-success' : 'btn-primary'}`}
                        style={{ borderRadius: '8px' }}
                    >
                        {isLoading ? 'Đang xử lý...' : (successMsg ? 'Thành công' : 'Lưu thay đổi')}
                    </button>

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

export default ChangePassword;