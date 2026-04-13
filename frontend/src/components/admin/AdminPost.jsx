import React, { useState, useEffect } from "react";
import axios from "axios";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  // === CẤU HÌNH API & TOKEN ===
  const API_URL = "https://xdudweb-php.onrender.com/api/admin/tin-dang";

  const getAxiosConfig = () => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    };
  };

  // ================== FETCH POSTS ==================
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAxiosConfig());
      const data = res.data?.data || res.data || [];
      setPosts(data);
    } catch (err) {
      console.error("Fetch posts error:", err.response?.data || err);
      alert("Lỗi tải danh sách bài đăng! Vui lòng kiểm tra lại đăng nhập.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

// ================== DUYỆT / ĐỔI TRẠNG THÁI TIN ==================
  const handleDuyetTin = async (post) => {
    const postId = post.id || post.ma_tin_dang || post.post_id;
    setLoadingId(postId);

    try {
      const currentStatus = post.trang_thai || post.status;
      
      // SỬA Ở ĐÂY: Dùng đúng các giá trị ENUM của bảng tin_dang
      // Nếu đang 'hoat_dong' thì chuyển về 'cho_duyet' (hoặc 'an'), ngược lại thì thành 'hoat_dong'
      const targetStatus = currentStatus === 'hoat_dong' ? 'cho_duyet' : 'hoat_dong';

      const payload = {
        trang_thai: targetStatus 
      };

      const res = await axios.post(`${API_URL}/${postId}/duyet`, payload, getAxiosConfig());
      
      const newStatus = res.data?.new_status || targetStatus;

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          (p.id || p.ma_tin_dang || p.post_id) === postId ? { ...p, trang_thai: newStatus, status: newStatus } : p
        )
      );
      
      alert(res.data?.message || "Đã cập nhật trạng thái tin đăng thành công!");
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data);
      const validationErrors = err.response?.data?.errors;
      if (validationErrors) {
        const errorMessages = Object.values(validationErrors).flat().join("\n");
        alert("Dữ liệu gửi lên không hợp lệ:\n" + errorMessages);
      } else {
        alert("Cập nhật thất bại: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoadingId(null);
    }
  };

  // ================== DELETE POST ==================
  const deletePost = async (post) => {
    const postId = post.id || post.ma_tin_dang || post.post_id;
    
    if (window.confirm(`XÓA bài đăng có ID #${postId}? Thao tác này không thể khôi phục!`)) {
      setLoadingId(postId);
      try {
        await axios.delete(`${API_URL}/${postId}`, getAxiosConfig());
        setPosts((prevPosts) => prevPosts.filter((p) => (p.id || p.ma_tin_dang || p.post_id) !== postId));
        alert("Xóa thành công!");
      } catch (err) {
        alert("Lỗi xóa tin đăng: " + (err.response?.data?.message || err.message));
      } finally {
        setLoadingId(null);
      }
    }
  };

  // ================== FORMATTERS ==================
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("vi-VN");
  };
  
  const formatPrice = (price) => {
    if (!price) return "Thỏa thuận";
    return Number(price).toLocaleString("vi-VN") + " ₫";
  };

  // ================== INIT ==================
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 post-management-container">
      <style>
        {`
          .post-management-container .table td,
          .post-management-container .table th {
            vertical-align: middle;
          }
          
          .post-management-container button {
            min-width: 70px;
          }
          
          .post-management-container .btn-icon {
            width: 32px;
            height: 32px;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s;
          }
          
          .post-management-container .btn-icon:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 fw-bold">Quản lý tin đăng</h3>
        <button onClick={fetchPosts} className="btn btn-primary btn-sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tiêu đề</th>
                <th>Người đăng</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>

            {!loading && posts.length > 0 && (
              <tbody>
                {posts.map((post) => {
                  // ĐỒNG BỘ VỚI DB LARAVEL DỰA TRÊN MODEL
                  const postId = post.id || post.ma_tin_dang || post.post_id;
                  const title = post.tieu_de || post.title;
                  const price = post.gia_thue || post.gia || post.price;
                  const status = post.trang_thai || post.status;
                  
                  // Lấy đúng cột ngay_dang
                  const date = post.ngay_dang || post.ngay_tao || post.created_at; 
                  
                  // Xử lý thông tin người đăng (thử lấy theo relation, nếu không có lấy ma_chu_nha)
                  const authorId = post.ma_chu_nha || post.nguoi_dung_id || "N/A";
                  // Nếu Backend có trả về relation nguoiDung (eager loading) -> lấy ho_ten
                  const authorName = post.nguoi_dung?.ho_ten || post.nguoiDung?.ho_ten;
                  const displayAuthor = authorName ? authorName : `ID: ${authorId}`;

                  const isApproved = status === "da_duyet" || status === "active" || status === "hoat_dong";

                  return (
                    <tr key={postId}>
                      <td>{postId}</td>
                      <td className="fw-semibold" title={title}>
                        {title?.length > 40 ? `${title.substring(0, 40)}...` : title}
                      </td>
                      <td>{displayAuthor}</td>
                      <td>{formatPrice(price)}</td>
                      <td>
                        <span className={`badge ${isApproved ? "bg-success" : "bg-warning text-dark"}`}>
                          {isApproved ? "Đã duyệt" : (status === "tu_choi" ? "Từ chối" : "Chờ duyệt/Ẩn")}
                        </span>
                      </td>
                      <td>{formatDate(date)}</td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className={`btn btn-sm btn-icon ${
                              isApproved ? "btn-outline-warning" : "btn-outline-success"
                            }`}
                            onClick={() => handleDuyetTin(post)}
                            disabled={loadingId === postId}
                            title={isApproved ? "Bỏ duyệt / Ẩn tin" : "Duyệt tin / Hiện tin"}
                          >
                            {loadingId === postId ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <i className={`bi ${isApproved ? "bi-eye-slash-fill" : "bi-check-circle-fill"}`}></i>
                            )}
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger btn-icon"
                            onClick={() => deletePost(post)}
                            disabled={loadingId === postId}
                            title="Xóa bài viết"
                          >
                            {loadingId === `delete-${postId}` ? (
                              <span className="spinner-border spinner-border-sm" role="status"></span>
                            ) : (
                              <i className="bi bi-trash-fill"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {loading && (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Đang tải danh sách bài đăng...</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-file-earmark-text fs-1"></i>
            <p>Chưa có bài đăng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostManagement;