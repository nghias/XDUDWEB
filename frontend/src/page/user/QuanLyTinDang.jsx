import React, { useState, useEffect } from 'react';

const QuanLyTinDang = () => {
    // view = 'list' (Bảng) hoặc 'form' (Trang nhập liệu giống Ảnh 1)
    const [view, setView] = useState('list');
    
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        tieu_de: '',
        mo_ta: '',
        gia_thue: '',
        dien_tich: '',
        ma_loai_phong: '1', 
        vi_tri_id: '1', // Thêm trường Khu vực
        trang_thai: 'hoat_dong'
    });

    const userData = JSON.parse(localStorage.getItem('user_session'));
    const token = localStorage.getItem('auth_token');

    // Fetch danh sách tin đăng
    const fetchMyPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`https://xdudweb-php.onrender.com/api/tin-dang-cua-toi/${userData.id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const result = await res.json();
            if (result.data) {
                setPosts(result.data);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData && userData.id) {
            fetchMyPosts();
        }
    }, []);

    // Xử lý Form Input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Xử lý Submit (Lưu)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing 
            ? `https://xdudweb-php.onrender.com/api/cap-nhat-tin-dang/${formData.id}`
            : `https://xdudweb-php.onrender.com/api/tao-tin-dang`;
        
        const method = isEditing ? 'PUT' : 'POST';
        
        // Payload gửi lên server
        const payload = {
            tieu_de: formData.tieu_de,
            mo_ta: formData.mo_ta,
            dien_tich: formData.dien_tich,
            trang_thai: formData.trang_thai,
            gia: formData.gia_thue, // Backend cần biến 'gia'
            nguoi_dung_id: userData.id,
            loai_phong_id: formData.ma_loai_phong,
            vi_tri_id: formData.vi_tri_id, 
            ngay_dang: isEditing ? formData.ngay_dang : new Date().toISOString().split('T')[0],
            luot_xem: isEditing ? formData.luot_xem : 0
        };

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json' 
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (res.ok || res.status === 201) {
                alert(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
                setView('list'); // Chuyển về màn hình danh sách
                fetchMyPosts(); 
            } else if (res.status === 422) {
                let errorString = "Vui lòng kiểm tra lại dữ liệu:\n";
                if (result.errors) {
                    for (const key in result.errors) {
                        errorString += `- ${result.errors[key][0]}\n`;
                    }
                }
                alert(errorString);
            } else {
                alert(result.message || 'Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Lỗi lưu tin:", error);
            alert("Không thể kết nối đến server.");
        }
    };

    // Xử lý Xóa
    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) return;
        try {
            const res = await fetch(`https://xdudweb-php.onrender.com/api/xoa-tin-dang/${id}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            if (res.ok) {
                alert('Xóa thành công!');
                fetchMyPosts();
            }
        } catch (error) {
            console.error("Lỗi xóa tin:", error);
        }
    };

    // Mở trang thêm mới
    const openAddForm = () => {
        setIsEditing(false);
        setFormData({ 
            id: null, 
            tieu_de: '', 
            mo_ta: '', 
            gia_thue: '', 
            dien_tich: '', 
            ma_loai_phong: '1', 
            vi_tri_id: '1',
            trang_thai: 'hoat_dong' 
        });
        setView('form');
    };

    // Mở trang sửa
    const openEditForm = (post) => {
        setIsEditing(true);
        setFormData({ 
            id: post.id,
            tieu_de: post.tieu_de,
            mo_ta: post.mo_ta,
            gia_thue: post.gia || post.gia_thue,
            dien_tich: post.dien_tich,
            ma_loai_phong: post.loai_phong_id || post.ma_loai_phong, 
            vi_tri_id: post.vi_tri_id || '1',
            trang_thai: post.trang_thai,
            ngay_dang: post.ngay_dang,
            luot_xem: post.luot_xem
        });
        setView('form');
    };

    const filteredPosts = posts.filter(post => 
        post.tieu_de && post.tieu_de.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ==========================================
    // RENDER VIEW DỰA TRÊN STATE
    // ==========================================

    // VIEW 1: GIAO DIỆN FORM ĐĂNG TIN (GIỐNG ẢNH 1)
    if (view === 'form') {
        return (
            <div className="container py-5 min-vh-100 bg-light">
                <button onClick={() => setView('list')} className="btn btn-link text-decoration-none mb-3 px-0 text-secondary fw-medium">
                    <i className="bi bi-arrow-left me-1"></i> Quay lại danh sách
                </button>
                
                <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: '750px', borderRadius: '12px', overflow: 'hidden' }}>
                    {/* Header màu xanh */}
                    <div className="bg-primary text-white p-4">
                        <h3 className="fw-bold mb-1">{isEditing ? 'Cập nhật tin đăng' : 'Đăng tin cho thuê mới'}</h3>
                        <p className="mb-0" style={{ fontSize: '14px', opacity: '0.9' }}>
                            Vui lòng nhập đầy đủ thông tin để để tin đăng được duyệt nhanh hơn
                        </p>
                    </div>

                    <div className="card-body p-4 p-md-5">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-4">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Tiêu đề tin</label>
                                    <input type="text" name="tieu_de" className="form-control py-2" placeholder="VD: Phòng trọ giá rẻ gần STU..." value={formData.tieu_de} onChange={handleInputChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Giá thuê (VNĐ)</label>
                                    <input type="number" name="gia_thue" className="form-control py-2" placeholder="VD: 3500000" value={formData.gia_thue} onChange={handleInputChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Diện tích (m²)</label>
                                    <input type="number" name="dien_tich" className="form-control py-2" placeholder="VD: 25" value={formData.dien_tich} onChange={handleInputChange} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Mô tả chi tiết</label>
                                    <textarea name="mo_ta" className="form-control" rows="5" placeholder="Mô tả về tiện ích, điện nước, nội thất..." value={formData.mo_ta} onChange={handleInputChange}></textarea>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Loại phòng</label>
                                    <select name="ma_loai_phong" className="form-select py-2" value={formData.ma_loai_phong} onChange={handleInputChange}>
                                        <option value="1">Phòng trọ</option>
                                        <option value="2">Căn hộ dịch vụ</option>
                                        <option value="3">Nhà nguyên căn</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Khu vực</label>
                                    <select name="vi_tri_id" className="form-select py-2" value={formData.vi_tri_id} onChange={handleInputChange}>
                                        <option value="1">Quận 1</option>
                                        <option value="2">Quận 2</option>
                                        <option value="8">Quận 8</option>
                                        {/* Bạn có thể bổ sung thêm các Option quận khác tại đây */}
                                    </select>
                                </div>

                                {/* Trạng thái (chỉ hiện khi sửa) */}
                                {isEditing && (
                                    <div className="col-12">
                                        <label className="form-label fw-bold">Trạng thái</label>
                                        <select name="trang_thai" className="form-select py-2" value={formData.trang_thai} onChange={handleInputChange}>
                                            <option value="hoat_dong">Hoạt động</option>
                                            <option value="cho_duyet">Chờ duyệt</option>
                                            <option value="da_cho_thue">Đã cho thuê</option>
                                        </select>
                                    </div>
                                )}

                                <div className="col-12 mt-5">
                                    <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-3 fs-5">
                                        <i className="bi bi-send me-2"></i> {isEditing ? 'Lưu cập nhật' : 'Đăng tin ngay'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                
                {/* Alert Lưu ý phía dưới form */}
                <div className="alert alert-warning mx-auto mt-4 d-flex align-items-center border-0 shadow-sm" style={{ maxWidth: '750px', backgroundColor: '#fff9e6' }}>
                    <i className="bi bi-exclamation-circle text-warning fs-4 me-3"></i>
                    <span className="small text-muted" style={{ lineHeight: '1.6' }}>
                        Lưu ý: Bạn phải chọn đúng <strong>Loại phòng</strong> và <strong>Khu vực</strong> hiện có trong hệ thống để tránh lỗi dữ liệu.
                    </span>
                </div>
            </div>
        );
    }

    // VIEW 2: GIAO DIỆN BẢNG DANH SÁCH (MẶC ĐỊNH)
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-primary">Quản lý tin đăng</h3>
                <button 
                    className="btn btn-warning text-dark fw-bold shadow-sm px-4 py-2" 
                    style={{ borderRadius: '8px' }}
                    onClick={openAddForm}
                >
                    <i className="bi bi-plus-circle me-2"></i> + Đăng tin
                </button>
            </div>

            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control border-start-0 ps-0" 
                            placeholder="Tìm kiếm theo tiêu đề..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ boxShadow: 'none' }}
                        />
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">ID</th>
                                    <th>Tiêu đề</th>
                                    <th>Giá thuê</th>
                                    <th>Diện tích</th>
                                    <th>Trạng thái</th>
                                    <th className="text-center pe-4">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="6" className="text-center py-5">Đang tải dữ liệu...</td></tr>
                                ) : filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <tr key={post.id}>
                                            <td className="ps-4 text-muted">#{post.id}</td>
                                            <td className="fw-medium text-truncate" style={{maxWidth: '250px'}} title={post.tieu_de}>{post.tieu_de}</td>
                                            <td className="text-danger fw-bold">
                                                {Number(post.gia || post.gia_thue).toLocaleString()} đ
                                            </td>
                                            <td>{post.dien_tich} m²</td>
                                            <td>
                                                <span className={`badge ${post.trang_thai === 'hoat_dong' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {post.trang_thai === 'hoat_dong' ? 'Đang hoạt động' : 'Đã ẩn/Chờ duyệt'}
                                                </span>
                                            </td>
                                            <td className="text-center pe-4">
                                                <button onClick={() => openEditForm(post)} className="btn btn-sm btn-outline-primary me-2">
                                                    <i className="bi bi-pencil-square me-1"></i> Sửa
                                                </button>
                                                <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-outline-danger">
                                                    <i className="bi bi-trash me-1"></i> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy tin đăng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyTinDang;