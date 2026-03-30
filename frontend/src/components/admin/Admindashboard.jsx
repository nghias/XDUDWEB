import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  // Thay thế ref bằng useState
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingPosts: 0,
    reportedPosts: 0,
  });

  // Thay thế onMounted bằng useEffect với dependency array rỗng []
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStats(res.data); // Thay thế cho stats.value = res.data
      } catch (err) {
        // Fallback data khi gọi API thất bại
        setStats({
          totalUsers: 3,
          totalPosts: 89,
          pendingPosts: 12,
          reportedPosts: 5,
        });
      }
    };

    fetchStats();
  }, []); // Mảng [] đảm bảo hàm này chỉ chạy 1 lần khi component render lần đầu

  return (
    <div className="row g-4">
      {/* Cột Tổng người dùng */}
      <div className="col-md-3">
        <div className="card bg-primary text-white">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">{stats.totalUsers}</h4>
              <p className="mb-0">Tổng người dùng</p>
            </div>
            <i className="bi bi-people-fill fs-1 opacity-75"></i>
          </div>
        </div>
      </div>

      {/* Cột Tổng tin đăng */}
      <div className="col-md-3">
        <div className="card bg-success text-white">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">{stats.totalPosts}</h4>
              <p className="mb-0">Tổng tin đăng</p>
            </div>
            <i className="bi bi-card-list fs-1 opacity-75"></i>
          </div>
        </div>
      </div>

      {/* Cột Tin chờ duyệt */}
      <div className="col-md-3">
        <div className="card bg-warning text-white">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">{stats.pendingPosts}</h4>
              <p className="mb-0">Tin chờ duyệt</p>
            </div>
            <i className="bi bi-clock-history fs-1 opacity-75"></i>
          </div>
        </div>
      </div>

      {/* Cột Tin bị báo cáo */}
      <div className="col-md-3">
        <div className="card bg-danger text-white">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">{stats.reportedPosts}</h4>
              <p className="mb-0">Tin bị báo cáo</p>
            </div>
            <i className="bi bi-flag-fill fs-1 opacity-75"></i>
          </div>
        </div>
      </div>

      {/* Phần Hoạt động gần đây */}
      <div className="col-12 mt-5">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Hoạt động gần đây</h5>
          </div>
          <div className="card-body">
            <p className="text-center text-muted">
              Sắp có bảng hoạt động chi tiết...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;