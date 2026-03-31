import React, { useState, useEffect } from "react";
import axios from "axios";

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  // ================== FETCH POSTS ==================
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Fetch posts error:", err.response || err);
      alert("Lỗi tải danh sách bài đăng");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // ================== TOGGLE STATUS ==================
  const toggleStatus = async (post) => {
    if (post.status !== "active" && post.status !== "hidden") {
      alert("Chỉ có thể Ẩn/Hiện bài đăng đã được duyệt (Active) hoặc đang bị ẩn (Hidden).");
      return;
    }

    const newStatus = post.status === "active" ? "hidden" : "active";
    setLoadingId(post.post_id);

    try {
      await axios.patch(`/admin/posts/${post.post_id}/status`, {
        status: newStatus,
      });

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.post_id === post.post_id ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      alert("Cập nhật thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setLoadingId(null);
    }
  };

  // ================== DELETE POST ==================
  const deletePost = async (post) => {
    if (window.confirm(`XÓA bài đăng #${post.post_id}? Không thể khôi phục!`)) {
      setLoadingId(post.post_id);
      try {
        await axios.delete(`/admin/posts/${post.post_id}`);
        setPosts((prevPosts) => prevPosts.filter((p) => p.post_id !== post.post_id));
        alert("Xóa thành công!");
      } catch (err) {
        alert("Lỗi xóa");
      } finally {
        setLoadingId(null);
      }
    }
  };

  // ================== FORMATTERS ==================
  const formatDate = (date) => new Date(date).toLocaleString("vi-VN");
  const formatPrice = (price) => Number(price).toLocaleString("vi-VN") + " ₫";

  // ================== INIT ==================
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4 post-management-container">
      {/* Nhúng CSS trực tiếp vào đây (Giống <style scoped> của Vue).
        Dùng cặp ngoặc nhọn {` `} để viết chuỗi nhiều dòng trong React.
      */}
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

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0 fw-bold">Quản lý tin đăng</h3>
        <button onClick={fetchPosts} className="btn btn-primary btn-sm">
          <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
      </div>

      {/* Table Card */}
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

            {!loading && (
              <tbody>
                {posts.map((post) => (
                  <tr key={post.post_id}>
                    <td>{post.post_id}</td>
                    <td className="fw-semibold">{post.title}</td>
                    <td>
                      {post.landlord_name || `Chủ trọ ID ${post.landlord_id}` || "N/A"}
                    </td>
                    <td>{formatPrice(post.price)}</td>
                    <td>
                      <span className={`badge ${post.status === "active" ? "bg-success" : "bg-secondary"}`}>
                        {post.status === "active" ? "Hiển thị" : "Đã ẩn"}
                      </span>
                    </td>
                    <td>{formatDate(post.created_at)}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className={`btn btn-sm btn-icon ${
                            post.status === "active" ? "btn-outline-warning" : "btn-outline-success"
                          }`}
                          onClick={() => toggleStatus(post)}
                          disabled={loadingId === post.post_id}
                          title={post.status === "active" ? "Ẩn bài viết" : "Hiện bài viết"}
                        >
                          <i className={`bi ${post.status === "active" ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger btn-icon"
                          onClick={() => deletePost(post)}
                          disabled={loadingId === post.post_id}
                          title="Xóa bài viết"
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3 text-muted">Đang tải danh sách bài đăng...</p>
          </div>
        )}

        {/* Empty State */}
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