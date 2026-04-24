import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const PackageManagement = () => {
  // === STATE MANAGEMENT ===
  const [packages, setPackages] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Gộp các trường của Laravel và giao diện AdminLayout
  const initialPackageState = {
    id: null,
    ten_goi: "",
    gia_tien: "",
    thoi_han_ngay: 30,
    muc_uu_tien: 1,      // Yêu cầu của Laravel
    so_tin_toi_da: 1,    // Lấy từ AdminLayout
    noi_bat: false,      // Lấy từ AdminLayout (is_highlight)
    mo_ta: "",           // Lấy từ AdminLayout (description)
  };
  const [currentPackage, setCurrentPackage] = useState(initialPackageState);

  // Tham chiếu đến Modal DOM Element
  const modalRef = useRef(null);

  // === CẤU HÌNH API & TOKEN ===
  const BASE_URL = "https://xdudweb-php.onrender.com/api";
  const PACKAGE_API_URL = `${BASE_URL}/admin/goidichvu`;
  const TRANSACTION_API_URL = `${BASE_URL}/admin/transactions`;

  // Hàm đính kèm Token bảo mật cho mỗi request
  const getAxiosConfig = () => {
    const token = localStorage.getItem("auth_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      }
    };
  };

  // === INITIALIZATION ===
  useEffect(() => {
    loadPackages();
    loadPendingTransactions();
  }, []);

  // === API CALLS ===
  const loadPackages = async () => {
    try {
      const res = await axios.get(PACKAGE_API_URL, getAxiosConfig()); 
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
      const res = await axios.get(`${TRANSACTION_API_URL}/pending`, getAxiosConfig());
      setPendingTransactions(res.data.data || []);
    } catch (err) {
      console.error("Lỗi tải giao dịch:", err);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...currentPackage,
        gia_tien: Number(currentPackage.gia_tien),
        thoi_han_ngay: Number(currentPackage.thoi_han_ngay),
        muc_uu_tien: Number(currentPackage.muc_uu_tien),
        so_tin_toi_da: Number(currentPackage.so_tin_toi_da),
        noi_bat: currentPackage.noi_bat ? 1 : 0,
      };

      if (isEditMode) {
        // Cập nhật gói (PUT) có kèm Config chứa Token
        await axios.put(`${PACKAGE_API_URL}/${payload.id}`, payload, getAxiosConfig());
        alert("Cập nhật thành công!");
      } else {
        // Thêm mới gói (POST) có kèm Config chứa Token
        await axios.post(PACKAGE_API_URL, payload, getAxiosConfig());
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
    if (!window.confirm(`Bạn chắc chắn muốn xóa gói "${pkg.ten_goi}"?`)) return;

    try {
      // Xóa gói (DELETE) có kèm Config chứa Token
      await axios.delete(`${PACKAGE_API_URL}/${pkg.id}`, getAxiosConfig());
      alert("Xóa thành công!");
      setPackages((prev) => prev.filter((p) => p.id !== pkg.id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi xóa!");
    }
  };

  const approve = async (id) => {
    if (!window.confirm("Xác nhận duyệt giao dịch này?")) return;
    try {
      // Lưu ý: với phương thức PATCH/POST nếu body rỗng thì truyền {} làm tham số thứ 2
      await axios.patch(`${TRANSACTION_API_URL}/${id}/approve`, {}, getAxiosConfig());
      alert("Duyệt thành công");
      setPendingTransactions((prev) => prev.filter((trx) => trx.transaction_id !== id));
    } catch (err) {
      alert("Lỗi khi duyệt giao dịch");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn từ chối giao dịch này?")) return;
    try {
      await axios.patch(`${TRANSACTION_API_URL}/${id}/reject`, {}, getAxiosConfig());
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
      noi_bat: pkg.noi_bat === 1 || pkg.noi_bat === true
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
                    <th>Số tin</th>
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
                      <tr key={pkg.id}>
                        <td className="ps-4 fw-bold text-primary">{pkg.ten_goi}</td>
                        <td className="fw-bold text-danger">{formatPrice(pkg.gia_tien)} đ</td>
                        <td>{pkg.thoi_han_ngay} ngày</td>
                        <td>{pkg.so_tin_toi_da || 0} tin</td>
                        <td>
                          <span className={`badge rounded-pill ${pkg.noi_bat ? "bg-success" : "bg-secondary"}`}>
                            {pkg.noi_bat ? "Nổi bật" : "Thường"}
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
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title">
                  <i className="bi bi-box-seam me-2"></i> 
                  {isEditMode ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ mới"}
                </h5>
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
                        value={currentPackage.ten_goi}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, ten_goi: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">Giá (VNĐ) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        step="1000"
                        className="form-control"
                        required
                        placeholder="VD: 50000"
                        value={currentPackage.gia_tien}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, gia_tien: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-bold">Thời hạn (Ngày)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="VD: 30"
                        required
                        value={currentPackage.thoi_han_ngay}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, thoi_han_ngay: e.target.value })}
                      />
                    </div>
                    
                    <div className="col-md-3">
                      <label className="form-label fw-bold">Mức ưu tiên</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="VD: 1"
                        required
                        value={currentPackage.muc_uu_tien}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, muc_uu_tien: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label fw-bold">Số tin tối đa</label>
                      <input
                        type="number"
                        className="form-control"
                        value={currentPackage.so_tin_toi_da}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, so_tin_toi_da: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3 d-flex align-items-end">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isHighlightCheck"
                          checked={currentPackage.noi_bat}
                          onChange={(e) => setCurrentPackage({ ...currentPackage, noi_bat: e.target.checked })}
                        />
                        <label className="form-check-label fw-bold" htmlFor="isHighlightCheck">
                          Là gói nổi bật?
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold">Mô tả gói</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Nhập mô tả chi tiết về quyền lợi..."
                        value={currentPackage.mo_ta}
                        onChange={(e) => setCurrentPackage({ ...currentPackage, mo_ta: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                  {/* Nút ẩn để có thể submit bằng phím Enter */}
                  <button type="submit" className="d-none"></button>
                </form>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Hủy
                </button>
                <button onClick={handleSubmit} className="btn btn-warning text-white" disabled={loading}>
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  {isEditMode ? "Cập nhật" : "Lưu gói dịch vụ"}
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
                          <button className="btn btn-sm btn-outline-success action-btn" onClick={() => approve(trx.transaction_id)}>
                            <i className="bi bi-check-circle-fill fs-5"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger action-btn" onClick={() => reject(trx.transaction_id)}>
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