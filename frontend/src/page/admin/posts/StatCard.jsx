import React from 'react';

const StatCard = ({
  title,
  value,
  trend,         // 'up' | 'down' | 'flat'
  trendValue,    // ví dụ: "+12%", "-3.4%"
  icon,
  color,         // primary, success, info, warning, danger...
  compareLabel = 'hôm qua' // Giá trị mặc định
}) => {
  // Thay thế computed formattedValue
  const formattedValue = typeof value === 'number' ? value.toLocaleString('vi-VN') : value;

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 small fw-medium">{title}</p>
            <h3 className="fw-bold mb-0">{formattedValue}</h3>
          </div>

          <div
            className={`rounded-circle p-3 bg-${color}-subtle text-${color}`}
            style={{
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className={`${icon} fs-4`}></i>
          </div>
        </div>

        <div className="mt-3 small">
          <span className={trend === 'up' ? 'text-success' : 'text-danger'}>
            <i className={trend === 'up' ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short'}></i>
            {trendValue}
          </span>
          <span className="text-muted ms-2">so với {compareLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;