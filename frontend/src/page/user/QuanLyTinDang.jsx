import React, { useState, useEffect } from 'react';

const QuanLyTinDang = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        tieu_de: '',
        mo_ta: '',
        gia_thue: '',
        dien_tich: '',
        ma_loai_phong: '1', 
        trang_thai: 'hoat_dong'
    });

    const userData = JSON.parse(localStorage.getItem('user_session'));
    const token = localStorage.getItem('auth_token');

    const fetchMyPosts = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`https://xdudweb-php.onrender.com/api/tin-dang-cua-toi/${userData.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
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
        fetchMyPosts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isEditing 
            ? `https://xdudweb-php.onrender.com/api/cap-nhat-tin-dang/${formData.id}`
            : `https://xdudweb-php.onrender.com/api/tao-tin-dang`;
        
        const method = isEditing ? 'PUT' : 'POST';
        
        const payload = {
            ...formData,
            ma_chu_nha: userData.id,
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

            if (res.ok) {
                alert(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
                setShowModal(false);
                fetchMyPosts();
            } else {
                alert('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Lỗi lưu tin:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tin đăng này?')) return;
        try {
            const res = await fetch(`https://xdudweb-php.onrender.com/api/xoa-tin-dang/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Xóa thành công!');
                fetchMyPosts();
            }
        } catch (error) {
            console.error("Lỗi xóa tin:", error);
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({ id: null, tieu_de: '', mo_ta: '', gia_thue: '', dien_tich: '', ma_loai_phong: '1', trang_thai: 'hoat_dong' });
        setShowModal(true);
    };

    const openEditModal = (post) => {
        setIsEditing(true);
        setFormData({ ...post });
        setShowModal(true);
    };

    const filteredPosts = posts.filter(post => 
        post.tieu_de.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-primary">Quản lý tin đăng</h3>
                <button className="btn btn-primary fw-bold" onClick={openAddModal}>
                    <i className="bi bi-plus-circle me-2"></i>Thêm tin mới
                </button>
            </div>

            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Tìm kiếm theo tiêu đề..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                                    <th>ID</th>
                                    <th>Tiêu đề</th>
                                    <th>Giá thuê</th>
                                    <th>Diện tích</th>
                                    <th>Trạng thái</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="6" className="text-center py-4">Đang tải dữ liệu...</td></tr>
                                ) : filteredPosts.length > 0 ? (
                                    filteredPosts.map(post => (
                                        <tr key={post.id}>
                                            <td>{post.id}</td>
                                            <td className="fw-medium text-truncate" style={{maxWidth: '250px'}}>{post.tieu_de}</td>
                                            <td className="text-danger fw-bold">{Number(post.gia_thue).toLocaleString()} đ</td>
                                            <td>{post.dien_tich} m²</td>
                                            <td>
                                                <span className={`badge ${post.trang_thai === 'hoat_dong' ? 'bg-success' : 'bg-secondary'}`}>
                                                    {post.trang_thai === 'hoat_dong' ? 'Đang hoạt động' : 'Đã ẩn/Chờ duyệt'}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <button onClick={() => openEditModal(post)} className="btn btn-sm btn-outline-primary me-2">
                                                    <i className="bi bi-pencil-square"></i> Sửa
                                                </button>
                                                <button onClick={() => handleDelete(post.id)} className="btn btn-sm btn-outline-danger">
                                                    <i className="bi bi-trash"></i> Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy tin đăng nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title fw-bold text-primary">{isEditing ? 'Cập nhật tin đăng' : 'Tạo tin đăng mới'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-medium">Tiêu đề *</label>
                                        <input type="text" name="tieu_de" className="form-control" value={formData.tieu_de} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Giá thuê (VND) *</label>
                                        <input type="number" name="gia_thue" className="form-control" value={formData.gia_thue} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Diện tích (m²) *</label>
                                        <input type="number" name="dien_tich" className="form-control" value={formData.dien_tich} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Loại phòng</label>
                                        <select name="ma_loai_phong" className="form-select" value={formData.ma_loai_phong} onChange={handleInputChange}>
                                            <option value="1">Phòng trọ</option>
                                            <option value="2">Căn hộ</option>
                                            <option value="3">Nhà nguyên căn</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Trạng thái</label>
                                        <select name="trang_thai" className="form-select" value={formData.trang_thai} onChange={handleInputChange}>
                                            <option value="hoat_dong">Hoạt động</option>
                                            <option value="cho_duyet">Chờ duyệt</option>
                                            <option value="da_cho_thue">Đã cho thuê</option>
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-medium">Mô tả chi tiết</label>
                                        <textarea name="mo_ta" className="form-control" rows="4" value={formData.mo_ta} onChange={handleInputChange}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary">{isEditing ? 'Lưu thay đổi' : 'Tạo tin'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyTinDang;