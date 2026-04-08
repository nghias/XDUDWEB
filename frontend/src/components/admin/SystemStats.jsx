import React, { useState, useEffect } from "react";
import StatCard from "../../page/admin/posts/SystemStatus";
import ActivityItem from "../../page/admin/posts/ActivityItem";

const SystemStats = () => {
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

  // === FETCH DATA (ĐÃ TẠM NGẮT API) ===
  const fetchStats = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // ✅ GIẢ LẬP DỮ LIỆU ĐỂ TRÁNH LỖI KHI BACKEND CHƯA CÓ API NÀY
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập load 0.5s

      setStats({
        activeUsers: 152,
        sessionsToday: 48,
        totalOrders: "24",
        todayRevenue: 3500000,
        cpuUsage: 35,
        memoryUsage: 55,
        diskUsage: 42,
      });

      setRecentActivities([]);
      setLastUpdated(new Date());
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("24h"); }}>24 giờ qua</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("7d"); }}>7 ngày</a></li>
                  <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); changeTimeRange("30d"); }}>30 ngày</a></li>
                </ul>
              </div>
              <button className="btn btn-outline-primary" onClick={refreshData}>
                <i className="bi bi-arrow-repeat me-1"></i>Làm mới
              </button>
            </div>
          </div>

          <div className="row g-4 mb-4">
            <div className="col-xl-3 col-lg-6">
              <StatCard title="Người dùng hoạt động" value={stats.activeUsers.toLocaleString("vi-VN")} trend="up" trendValue="+12%" icon="bi bi-people-fill" color="primary" />
            </div>
            <div className="col-xl-3 col-lg-6">
              <StatCard title="Phiên đăng nhập hôm nay" value={stats.sessionsToday.toLocaleString("vi-VN")} trend="up" trendValue="+18%" icon="bi bi-box-arrow-in-right" color="success" />
            </div>
            <div className="col-xl-3 col-lg-6">
              <StatCard title="Tổng đơn hàng / Tin đăng" value={stats.totalOrders} trend="down" trendValue="-3%" icon="bi bi-cart-check-fill" color="info" />
            </div>
            <div className="col-xl-3 col-lg-6">
              <StatCard title="Doanh thu hôm nay" value={formatCurrency(stats.todayRevenue)} trend="up" trendValue="+24%" icon="bi bi-currency-dollar" color="warning" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemStats;