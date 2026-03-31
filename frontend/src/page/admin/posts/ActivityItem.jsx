import React from 'react';

const ActivityItem = ({ activity = {} }) => {
  // Trích xuất dữ liệu với giá trị mặc định (Tương đương với computed bên Vue)
  const action = activity.action || "Hoạt động";
  const user = activity.user || "";
  const description = activity.description || "";
  const time = activity.time || "Không rõ";
  const target = activity.target || "";
  const type = activity.type || "info";

  // Hàm xử lý class màu sắc
  const getAvatarBg = (activityType) => {
    const styles = {
      success: "bg-success-subtle text-success",
      warning: "bg-warning-subtle text-warning",
      danger: "bg-danger-subtle text-danger",
      info: "bg-info-subtle text-info",
      primary: "bg-primary-subtle text-primary",
    };
    return styles[activityType] || styles.info;
  };

  // Hàm xử lý icon
  const getIcon = (activityType) => {
    const icons = {
      login: "bi bi-box-arrow-in-right",
      logout: "bi bi-box-arrow-right",
      create: "bi bi-plus-circle",
      update: "bi bi-pencil-square",
      delete: "bi bi-trash",
      error: "bi bi-exclamation-triangle",
    };
    return icons[activityType] || "bi bi-activity";
  };

  return (
    <div className="list-group-item list-group-item-action px-0 py-3">
      <div className="d-flex align-items-start gap-3">
        {/* Avatar/Icon */}
        <div
          className={`rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center ${getAvatarBg(type)}`}
          style={{ width: "48px", height: "48px" }}
        >
          <i className={`${getIcon(type)} fs-5`}></i>
        </div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div className="fw-medium">{action}</div>
            <small className="text-muted">{time}</small>
          </div>

          <div className="text-muted small mb-1">
            {/* Tương đương v-if="user" */}
            {user && (
              <span>
                <strong>{user}</strong>
                <span className="mx-1">•</span>
              </span>
            )}
            {description}
          </div>

          {/* Tương đương v-if="target" */}
          {target && (
            <div className="small">
              <span className="badge bg-light text-dark border">{target}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;