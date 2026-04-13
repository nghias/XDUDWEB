import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    
    // Thêm trạng thái loading để vô hiệu hóa nút khi đang gọi API
    const [isLoading, setIsLoading] = useState(false);
    
    // Khởi tạo state chứa thông tin người dùng (thêm trường id)
    const [formData, setFormData] = useState({
        id: '',
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
                    id: userData.id || '', // Lấy ID để gọi API
                    ho_ten: userData.ho_ten || '',
                    email: userData.email || '',
                    so_dien_thoai: userData.so_dien_thoai || '',
                    vai_tro: userData.vai_tro || '',
                    anh_dai_dien: userData.anh_dai_dien || '',
                    ngay_tao: userData.ngay_tao || ''
                });
            } else {
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

    // Hàm submit gọi API Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.id) {
            alert("Lỗi: Không tìm thấy ID người dùng!");
            return;
        }

        setIsLoading(true);
        const token = localStorage.getItem("auth_token");

        try {
            // Gọi API PUT theo Backend
            const response = await fetch(`https://xdudweb-php.onrender.com/api/cap-nhat-nguoi-dung/${formData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Truyền token nếu route yêu cầu bảo mật
                    'Accept': 'application/json'
                },
                // Chỉ gửi lên những thông tin cho phép sửa
                body: JSON.stringify({
                    ho_ten: formData.ho_ten,
                    so_dien_thoai: formData.so_dien_thoai
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Cập nhật thông tin thành công!");
                
                // CẬP NHẬT LẠI LOCALSTORAGE
                // Backend trả về dữ liệu mới trong result.data, ta sẽ lưu đè vào session
                if (result.data) {
                    localStorage.setItem("user_session", JSON.stringify(result.data));
                }
            } else {
                alert(result.message || "Cập nhật thất bại. Vui lòng kiểm tra lại!");
            }
        } catch (error) {
            console.error("Lỗi cập nhật profile:", error);
            alert("Lỗi kết nối server!");
        } finally {
            setIsLoading(false);
        }
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
                                            required
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
                                            onChange={(e) => handleChange({ target: { name: 'so_dien_thoai', value: e.target.value.replace(/\D/g, '') } })} // Chỉ cho nhập số
                                            maxLength="10"
                                            required
                                        />
                                    </div>

                                    {/* Email (Không cho sửa) */}
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
                                            value={
                                                formData.vai_tro === 'quan_tri' ? 'Quản trị viên' : 
                                                formData.vai_tro === 'chu_nha' ? 'Chủ nhà' : 
                                                formData.vai_tro === 'nguoi_tim_phong' ? 'Người tìm phòng' : 
                                                'Chưa cập nhật'
                                            }
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
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary px-4 fw-bold"
                                        disabled={isLoading} 
                                        style={{ borderRadius: '8px' }}
                                    >
                                        {isLoading ? (
                                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Đang lưu...</>
                                        ) : 'Lưu thay đổi'}
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