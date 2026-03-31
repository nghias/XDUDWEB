import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PackageManagement = () => {
  // === STATE MANAGEMENT ===
  const [packages, setPackages] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const initialPackageState = {
    package_id: null,
    package_name: "",
    price: "",
    duration_days: 30,
    max_posts: 1,
    is_highlight: false,
    description: "",
  };
  const [currentPackage, setCurrentPackage] = useState(initialPackageState);

  // Tham chiếu đến Modal DOM Element
  const modalRef = useRef(null);

  // === INITIALIZATION ===
  useEffect(() => {
    loadPackages();
    loadPendingTransactions();
  }, []);

  // === API CALLS ===
  const loadPackages = async () => {
    try {
      const res = await axios.get("/admin/packages");
      if (res.data && res.data.data) {
        setPackages(res.data.data);
      } else {
        setPackages([]);
      }
    } catch (err) {
      console.error(err);
      alert("Không tải được danh sách gói!");
    }
  };

  const loadPendingTransactions = async () => {
    try {
      const res = await axios.get("/admin/transactions/pending");
      setPendingTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Không tải được giao dịch chờ duyệt!");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...currentPackage,
        is_highlight: currentPackage.is_highlight ? 1 : 0,
      };

      if (isEditMode) {
        await axios.put(`/admin/packages/${payload.package_id}`, payload);
        alert("Cập nhật thành công!");
      } else {
        await axios.post("/admin/packages", payload);
        alert("Thêm gói mới thành công!");
      }

      await loadPackages();
      hideModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Đã có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async (pkg) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa gói "${pkg.package_name}"?`)) return;

    try {
      await axios.delete(`/admin/packages/${pkg.package_id}`);
      alert("Xóa thành công!");
      // Thay vì gọi API lại, có thể cập nhật state ngay lập tức cho mượt
      setPackages((prev) => prev.filter((p) => p.package_id !== pkg.package_id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi xóa!");
    }
  };

  const approve = async (id) => {
    if (!window.confirm("Xác nhận duyệt giao dịch này?")) return;
    try {
      await axios.patch(`/admin/transactions/${id}/approve`);
      alert("Duyệt thành công");
      setPendingTransactions((prev) => prev.filter((trx) => trx.transaction_id !== id));
    } catch (err) {
      alert("Lỗi khi duyệt giao dịch");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn từ chối giao dịch này?")) return;
    try {
      await axios.patch(`/admin/transactions/${id}/reject`);
      alert("Đã từ chối giao dịch");
      setPendingTransactions((prev) => prev.filter((trx) => trx.transaction_id !== id));
    } catch (err) {
      alert("Lỗi khi từ chối giao dịch");
    }
  };

  // === MODAL & UI HELPERS ===
  const showModal = () => {
    if (window.bootstrap && modalRef.current) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();
    }
  };

  const hideModal = () => {
    if (window.bootstrap && modalRef.current) {
      const modal = window.bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    }
  };

  const openCreateModal = () => {
    setCurrentPackage(initialPackageState);
    setIsEditMode(false);
    showModal();
  };

  const openEditModal = (pkg) => {
    setCurrentPackage({
      ...pkg,
      is_highlight: pkg.is_highlight === 1 || pkg.is_highlight === true,
    });
    setIsEditMode(true);
    showModal();
  };

  const formatPrice = (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <div className="package-management-container p-4">
      {/* SCOPED CSS */}
      <style>
        {`
          .package-management-container .table th {
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            color: #6c757d;
          }
          .package-management-container .action-btn {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
          .package-management-container .action-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .package-management-container .action-btn:active {
            transform: translateY(0);
          }
        `}
      </style>

      {/* ===== PHẦN 1: QUẢN LÝ GÓI DỊCH VỤ ===== */}
      <div className="package-management">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Quản lý Gói Dịch Vụ</h2>
          <button className="btn btn-warning text-white" onClick={openCreateModal}>
            <i className="bi bi-plus-circle-fill me-2"></i> Thêm gói mới
          </button>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Tên gói</th>
                    <th>Giá (VNĐ)</th>
                    <th>Thời hạn</th>
                    <th>Tin đăng</th>
                    <th>Trạng thái</th>
                    <th className="text-end pe-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Chưa có gói dịch vụ nào.
                      </td>
                    </tr>
                  ) : (
                    packages.map((pkg) => (
                      <tr key={pkg.package_id}>
                        <td className="ps-4 fw-bold text-primary">{pkg.package_name}</td>
                        <td className="fw-bold text-danger">{formatPrice(pkg.price)} đ</td>
                        <td>{pkg.duration_days} ngày</td>
                        <td>{pkg.max_posts} tin</td>
                        <td>
                          <span className={`badge rounded-pill ${pkg.is_highlight ? "bg-success" : "bg-secondary"}`}>
                            {pkg.is_highlight ? "Nổi bật" : "Thường"}
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(pkg)}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(pkg)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL THÊM/SỬA GÓI DỊCH VỤ */}
        <div className="modal fade" id="packageModal" tabIndex="-1" aria-hidden="true" ref={modalRef}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className={`modal-header ${isEditMode ? "bg-primary text-white" : "bg-warning text-white"}`}>
                <h5 className="modal-title">{isEditMode ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ mới"}</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Tên gói <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="VD: Gói VIP 1"
                        value={currentPackage.package_name}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, package_name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Giá (VNĐ) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="1000"
                        className="form-control"
                        required
                        value={currentPackage.price}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Thời hạn (Ngày)</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={currentPackage.duration_days}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, duration_days: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Số tin tối đa</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={currentPackage.max_posts}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, max_posts: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="highlightCheck"
                          checked={currentPackage.is_highlight}
                          onChange={(e) => setCurrentPackage({ ...currentPackage, is_highlight: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold" htmlFor="highlightCheck">
                          Đặt làm gói Nổi Bật
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Mô tả</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={currentPackage.description}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  <button type="submit" className="d-none"></button>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className={`btn ${isEditMode ? "btn-primary" : "btn-warning text-white"}`}
                  disabled={loading}
                >
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  {isEditMode ? "Lưu thay đổi" : "Tạo mới"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PHẦN 2: GIAO DỊCH CHỜ DUYỆT ===== */}
      <div className="card shadow-sm border-0 mt-5">
        <div className="card-header bg-white">
          <h5 className="fw-bold text-warning mb-0">
            <i className="bi bi-hourglass-split me-2"></i> Giao dịch chờ duyệt
          </h5>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Mã GD</th>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Gói</th>
                  <th>Số tiền</th>
                  <th>Ngày tạo</th>
                  <th className="text-end pe-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {pendingTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      Không có giao dịch chờ duyệt
                    </td>
                  </tr>
                ) : (
                  pendingTransactions.map((trx) => (
                    <tr key={trx.transaction_id}>
                      <td className="ps-4 fw-bold text-primary">{trx.transaction_ref}</td>
                      <td>{trx.full_name}</td>
                      <td>{trx.email}</td>
                      <td>{trx.package_name}</td>
                      <td className="fw-bold text-danger">{formatPrice(trx.amount)} đ</td>
                      <td>{new Date(trx.created_at).toLocaleString("vi-VN")}</td>
                      <td className="text-end pe-4">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn btn-sm btn-outline-success border-0 rounded-pill shadow-sm action-btn"
                            onClick={() => approve(trx.transaction_id)}
                            title="Duyệt giao dịch"
                          >
                            <i className="bi bi-check-circle-fill fs-5"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger border-0 rounded-pill shadow-sm action-btn"
                            onClick={() => reject(trx.transaction_id)}
                            title="Từ chối giao dịch"
                          >
                            <i className="bi bi-x-circle-fill fs-5"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageManagement;