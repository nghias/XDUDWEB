import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    
    // Khởi tạo state chứa thông tin người dùng
    const [formData, setFormData] = useState({
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        vai_tro: '',
        anh_dai_dien: '',
        ngay_tao: ''
    });

    // Lấy dữ liệu từ localStorage khi component được mount
    useEffect(() => {
        try {
            const userSession = localStorage.getItem("user_session");
            if (userSession && userSession !== "undefined") {
                const userData = JSON.parse(userSession);
                setFormData({
                    ho_ten: userData.ho_ten || '',
                    email: userData.email || '',
                    so_dien_thoai: userData.so_dien_thoai || '',
                    vai_tro: userData.vai_tro || '',
                    anh_dai_dien: userData.anh_dai_dien || '',
                    ngay_tao: userData.ngay_tao || ''
                });
            } else {
                // Nếu chưa đăng nhập, chuyển hướng về trang login
                navigate('/login');
            }
        } catch (error) {
            console.error("Lỗi khi đọc dữ liệu user:", error);
            navigate('/login');
        }
    }, [navigate]);

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Hàm submit (hiện tại chỉ preventDefault vì chưa có API)
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Chức năng cập nhật thông tin đang được phát triển!");
    };

    // Avatar mặc định nếu user chưa có ảnh
    const defaultAvatar = formData.ho_ten
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.ho_ten)}&background=0D8ABC&color=fff&size=150`
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    return (
        <div className="container py-5 min-vh-100 bg-light">
            <div className="row justify-content-center">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                        <div className="card-header bg-white border-bottom py-3">
                            <h4 className="mb-0 fw-bold text-primary">Thông Tin Cá Nhân</h4>
                        </div>
                        
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                {/* Phần Avatar */}
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <img 
                                            src={formData.anh_dai_dien || defaultAvatar} 
                                            alt="Avatar" 
                                            className="rounded-circle border shadow-sm"
                                            width="120"
                                            height="120"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <p className="text-muted mt-2 small">Ảnh đại diện</p>
                                </div>

                                <div className="row">
                                    {/* Họ và tên */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-medium text-secondary">Họ và tên</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            name="ho_ten"
                                            value={formData.ho_ten}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Số điện thoại */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-medium text-secondary">Số điện thoại</label>
                                        <input 
                                            type="tel" 
                                            className="form-control" 
                                            name="so_dien_thoai"
                                            value={formData.so_dien_thoai}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    {/* Email (Thường không cho sửa trực tiếp ở đây) */}
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-medium text-secondary">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control bg-light" 
                                            name="email"
                                            value={formData.email}
                                            readOnly
                                            disabled
                                        />
                                        <div className="form-text">Email không thể thay đổi.</div>
                                    </div>

                                    {/* Vai trò */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-medium text-secondary">Vai trò</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light text-capitalize" 
                                            value={formData.vai_tro === 'admin' ? 'Quản trị viên' : formData.vai_tro === 'chu_tro' ? 'Chủ trọ' : 'Người thuê'}
                                            readOnly
                                            disabled
                                        />
                                    </div>

                                    {/* Ngày tham gia */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-medium text-secondary">Ngày tham gia</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light" 
                                            value={formData.ngay_tao ? new Date(formData.ngay_tao).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                </div>

                                <hr className="my-4" />

                                {/* Nút lưu */}
                                <div className="d-flex justify-content-end align-items-center">
                                    <span className="text-danger me-3 small fst-italic">
                                        * Tính năng lưu tạm thời bị khóa do API đang hoàn thiện.
                                    </span>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary px-4 fw-bold"
                                        disabled // TẠM KHÓA NÚT LƯU
                                        style={{ borderRadius: '8px' }}
                                    >
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;