import React from "react";

const SystemStatusItem = ({ 
  label, 
  value, 
  description, 
  status = "info" // Giá trị mặc định tương đương default: "info" của Vue
}) => {
  // Map chứa các trạng thái
  const statusMap = {
    success: { text: "Tốt", class: "bg-success-subtle text-success" },
    warning: { text: "Cảnh báo", class: "bg-warning-subtle text-warning" },
    danger: { text: "Nguy hiểm", class: "bg-danger-subtle text-danger" },
    info: { text: "Bình thường", class: "bg-info-subtle text-info" },
    secondary: { text: "-", class: "bg-secondary-subtle text-secondary" },
  };

  // Lấy thông tin trạng thái hiện tại (nếu truyền vào sai status, tự động fallback về secondary)
  const currentStatus = statusMap[status] || statusMap.secondary;

  return (
    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
      <div>
        <div className="fw-medium">{label}</div>
        
        {/* Render có điều kiện tương đương v-if="description" */}
        {description && (
          <div className="small text-muted">{description}</div>
        )}
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className="fw-bold">{value}</span>

        <span className={`badge rounded-pill px-3 py-2 fw-medium ${currentStatus.class}`}>
          {currentStatus.text}
        </span>
      </div>
    </div>
  );
};

export default SystemStatusItem;