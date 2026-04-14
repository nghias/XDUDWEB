import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QuanLyTinDang = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userData = JSON.parse(localStorage.getItem('user_session'));
    const token = localStorage.getItem('auth_token');

    // Lấy danh sách tin
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
                fetchMyPosts(); // Cập nhật lại bảng
            }
        } catch (error) {
            console.error("Lỗi xóa tin:", error);
        }
    };

    // Điều hướng sang trang Đăng Tin Mới
    const handleAddNew = () => {
        navigate('/dang-tin'); // Đảm bảo route trong App.jsx đã có cấu hình này
    };

    // Điều hướng sang trang Đăng Tin để SỬA
    const handleEdit = (post) => {
        // Map lại dữ liệu backend về đúng tên trường của form DangTin
        const editData = {
            id: post.id,
            tieu_de: post.tieu_de,
            mo_ta: post.mo_ta,
            gia_thue: post.gia || post.gia_thue,
            dien_tich: post.dien_tich,
            ma_loai_phong: post.loai_phong_id || post.ma_loai_phong || "1", 
            ma_vi_tri: post.vi_tri_id || "1",
            trang_thai: post.trang_thai
        };
        // Truyền editData thông qua state
        navigate('/dang-tin', { state: { editData } });
    };

    const filteredPosts = posts.filter(post => 
        post.tieu_de && post.tieu_de.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-4 min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-primary">Quản lý tin đăng</h3>
                <button 
                    className="btn btn-warning text-dark fw-bold shadow-sm px-4 py-2" 
                    style={{ borderRadius: '8px' }}
                    onClick={handleAddNew}
                >
                    <i className="bi bi-plus-circle me-2"></i> + Đăng tin
                </button>
            </div>

            <div className="card shadow-sm mb-4 border-0">
                <div className="card-body">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
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
                                                <button onClick={() => handleEdit(post)} className="btn btn-sm btn-outline-primary me-2">
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