import React, { useState, useEffect } from "react";
// Đảm bảo đường dẫn import component con chính xác với cấu trúc thư mục của bạn
import StatCard from "../../page/admin/posts/SystemStatus";
import ActivityItem from "../../page/admin/posts/ActivityItem";
// import SystemStatusItem from "../../components/admin/SystemStatus"; // Đã import nhưng chưa dùng tới

const SystemStats = () => {
  // === STATE ===
  const [stats, setStats] = useState({
    activeUsers: 0,
    sessionsToday: 0,
    totalOrders: "0",
    todayRevenue: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeRangeLabel, setTimeRangeLabel] = useState("24 giờ qua");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // === FETCH DATA ===
  const fetchStats = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Vui lòng đăng nhập để xem thống kê");

      const response = await fetch("http://localhost:5000/api/admin/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(errData || `Lỗi ${response.status}: Không thể tải dữ liệu`);
      }

      const data = await response.json();

      setStats({
        activeUsers: Number(data.activeUsers) || 0,
        sessionsToday: Number(data.sessionsToday) || 0,
        totalOrders: (Number(data.totalPosts) || 0).toLocaleString("vi-VN"),
        todayRevenue: Number(data.todayRevenue) || 0,
        cpuUsage: Number(data.cpuUsage) || 0,
        memoryUsage: Number(data.memoryUsage) || 0,
        diskUsage: Number(data.diskUsage) || 0,
      });

      setRecentActivities(Array.isArray(data.recentActivities) ? data.recentActivities : []);
      setLastUpdated(new Date());
    } catch (err) {
      setErrorMsg(err.message);
      console.error("Lỗi fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // === LIFECYCLE ===
  useEffect(() => {
    fetchStats();
  }, []);

  // === METHODS ===
  const refreshData = () => fetchStats();

  const changeTimeRange = (range) => {
    const labels = {
      "24h": "24 giờ qua",
      "7d": "7 ngày",
      "30d": "30 ngày",
      custom: "Tùy chỉnh",
    };
    setTimeRangeLabel(labels[range] || "24 giờ qua");
  };

  const getStatus = (value) => {
    if (value > 85) return "danger";
    if (value > 70) return "warning";
    return "success";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="container-fluid py-4 system-stats-container">
      {/* CSS Nhúng trực tiếp */}
      <style>
        {`
          .system-stats-container .chart-container {
            position: relative;
          }
          .system-stats-container .placeholder-chart {
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          }
        `}
      </style>

      {/* Xử lý điều kiện hiển thị (v-if / v-else-if / v-else) */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Đang tải dữ liệu thống kê từ hệ thống...</p>
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger alert-dismissible fade show">
          {errorMsg}
          <button type="button" className="btn-close" onClick={() => setErrorMsg(null)}></button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 fw-bold">Thống kê hệ thống</h2>
              <p className="text-muted mb-0">Cập nhật lần cuối: {formatDate(lastUpdated)}</p>
            </div>

            <div className="d-flex gap-3">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                >
                  Thời gian: {timeRangeLabel}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("24h"); }}>
                      24 giờ qua
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("7d"); }}>
                      7 ngày
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("30d"); }}>
                      30 ngày
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("custom"); }}>
                      Tùy chỉnh...
                    </a>
                  </li>
                </ul>
              </div>

              <button className="btn btn-outline-primary" onClick={refreshData}>
                <i className="bi bi-arrow-repeat me-1"></i>Làm mới
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-4">
            <div className="col-xl-3 col-lg-6">
              <StatCard
                title="Người dùng hoạt động"
                value={stats.activeUsers.toLocaleString("vi-VN")}
                trend="up"
                trendValue="+12%"
                icon="bi bi-people-fill"
                color="primary"
              />
            </div>
            <div className="col-xl-3 col-lg-6">
              <StatCard
                title="Phiên đăng nhập hôm nay"
                value={stats.sessionsToday.toLocaleString("vi-VN")}
                trend="up"
                trendValue="+18%"
                icon="bi bi-box-arrow-in-right"
                color="success"
              />
            </div>
            <div className="col-xl-3 col-lg-6">
              <StatCard
                title="Tổng đơn hàng"
                value={stats.totalOrders}
                trend="down"
                trendValue="-3%"
                icon="bi bi-cart-check-fill"
                color="info"
              />
            </div>
            <div className="col-xl-3 col-lg-6">
              <StatCard
                title="Doanh thu hôm nay"
                value={formatCurrency(stats.todayRevenue)}
                trend="up"
                trendValue="+24%"
                icon="bi bi-currency-dollar"
                color="warning"
              />
            </div>
          </div>

          {/* Hoạt động gần đây */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <h5 className="card-title mb-0">Hoạt động gần đây</h5>
            </div>
            
            <div className="list-group list-group-flush">
              {recentActivities.map((item) => (
                <ActivityItem key={item.id} activity={item} />
              ))}
            </div>

            {recentActivities.length === 0 && (
              <div className="card-body text-center text-muted">
                Chưa có hoạt động nào trong khoảng thời gian này.
              </div>
            )}
            
            <div className="card-footer bg-white text-center border-0">
              <button className="btn btn-sm btn-link text-muted">Xem thêm hoạt động →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemStats;