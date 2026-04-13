import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Plus, Package } from "lucide-react";

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- LOGIC LOAD TIN----
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user_session"));
        const response = await axios.get(
          `https://xdudweb-php.onrender.com/api/tin-dang-cua-toi/${userData.id}`,
        );
        setMyPosts(response.data.data || []);
      } catch (error) {
        console.error("Lỗi lấy danh sách tin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);
  // --- LOGIC XÓA TIN ---
  const handleDelete = async (postId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin đăng này không?")) {
      try {
        const token = localStorage.getItem("auth_token");
        await axios.delete(
          `https://xdudweb-php.onrender.com/api/xoa-tin-dang/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        alert("Xóa tin thành công!");
        // Cập nhật lại state để tin đó biến mất khỏi màn hình ngay lập tức
        setMyPosts(myPosts.filter((post) => post.id !== postId));
      } catch (error) {
        alert(
          "Lỗi khi xóa: " + (error.response?.data?.message || "Không xác định"),
        );
      }
    }
  };
  // --- LOGIC SỬA TIN ---
  const handleEdit = (post) => {
    //  truyền object 'post' để sang trang DangTin
    navigate("/dang-tin", { state: { editData: post } });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold m-0">Tin đăng của tôi</h2>
          <p className="text-muted">
            Quản lý các bài đăng tìm khách thuê phòng
          </p>
        </div>
        <Link
          to="/dang-tin"
          className="btn btn-primary rounded-pill px-4 fw-bold"
        >
          <Plus size={18} className="me-1" /> Đăng tin mới
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">Đang tải danh sách...</div>
      ) : myPosts.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
          <Package size={60} className="mx-auto text-muted mb-3" />
          <h4>Bạn chưa có tin đăng nào</h4>
          <p className="text-muted">
            Hãy bắt đầu bằng việc đăng tin đầu tiên của bạn!
          </p>
          <Link
            to="/dang-tin"
            className="btn btn-outline-primary rounded-pill mt-2"
          >
            Đăng tin ngay
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {myPosts.map((post) => (
            <div key={post.id} className="col-12">
              <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={`https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=200&auto=format&fit=crop&sig=${post.id}`}
                      className="img-fluid rounded-3"
                      alt="room"
                    />
                  </div>
                  <div className="col-md-6">
                    <h5 className="fw-bold mb-1">{post.tieu_de}</h5>
                    <p className="text-primary fw-bold mb-1">
                      {new Intl.NumberFormat("vi-VN").format(
                        post.gia_thue || post.gia_thue,
                      )}{" "}
                      VNĐ/tháng
                    </p>
                    <small className="text-muted">
                      Diện tích: {post.dien_tich} m²
                    </small>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    <div className="d-flex gap-2 justify-content-md-end">
                      <Link
                        to={`/chi-tiet-tin-dang/${post.id}`}
                        className="btn btn-light btn-sm rounded-circle p-2"
                      >
                        <Eye size={18} />
                      </Link>
                      {/* BUTTON SỬA */}
                      <button
                        onClick={() => handleEdit(post)} // Truyền nguyên object 'post' vào đây
                        className="btn btn-light btn-sm rounded-circle p-2 text-primary"
                      >
                        <Edit size={18} />
                      </button>
                      {/* BUTTON XÓA */}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="btn btn-light btn-sm rounded-circle p-2 text-danger"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
