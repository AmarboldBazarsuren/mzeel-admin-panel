// admin-panel/src/pages/dashboard/DashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Card from '../../components/common/Card';
import { formatCurrency } from '../../utils/formatters';
import './DashboardPage.css';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await api.getDashboard();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Ачааллаж байна...</div>;
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-heading">Dashboard</h1>

      {/* User Stats */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon user">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.users?.total || 0}</div>
            <div className="stat-label">Нийт хэрэглэгч</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon active">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.users?.active || 0}</div>
            <div className="stat-label">Идэвхтэй</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon verified">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.users?.verified || 0}</div>
            <div className="stat-label">Баталгаажсан</div>
          </div>
        </Card>
      </div>

      {/* Loan Stats */}
      <h2 className="section-heading">Зээлийн статистик</h2>
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon loan">💳</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.loans?.total || 0}</div>
            <div className="stat-label">Нийт зээл</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.loans?.pending || 0}</div>
            <div className="stat-label">Хүлээгдэж байгаа</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon active-loan">🔥</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.loans?.active || 0}</div>
            <div className="stat-label">Идэвхтэй зээл</div>
          </div>
        </Card>

        <Card className="stat-card">
          <div className="stat-icon overdue">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.loans?.overdue || 0}</div>
            <div className="stat-label">Хугацаа хэтэрсэн</div>
          </div>
        </Card>
      </div>

      {/* Money Stats */}
      <h2 className="section-heading">Мөнгөн статистик</h2>
      <div className="stats-grid">
        <Card className="stat-card large">
          <div className="stat-icon money">💰</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats?.loans?.disbursed || 0)}</div>
            <div className="stat-label">Олгосон зээл</div>
          </div>
        </Card>

        <Card className="stat-card large">
          <div className="stat-icon money">💵</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats?.loans?.paid || 0)}</div>
            <div className="stat-label">Төлөгдсөн</div>
          </div>
        </Card>

        <Card className="stat-card large">
          <div className="stat-icon money">📊</div>
          <div className="stat-info">
            <div className="stat-value">{formatCurrency(stats?.wallets?.totalBalance || 0)}</div>
            <div className="stat-label">Хэтэвчний нийт үлдэгдэл</div>
          </div>
        </Card>
      </div>

      {/* Withdrawal Stats */}
      {stats?.withdrawals && (
        <>
          <h2 className="section-heading">Татах хүсэлт</h2>
          <div className="stats-grid">
            <Card className="stat-card">
              <div className="stat-icon withdrawal">📤</div>
              <div className="stat-info">
                <div className="stat-value">{stats.withdrawals.pending || 0}</div>
                <div className="stat-label">Хүлээгдэж байгаа</div>
              </div>
            </Card>

            <Card className="stat-card large">
              <div className="stat-icon money">💸</div>
              <div className="stat-info">
                <div className="stat-value">{formatCurrency(stats.withdrawals.pendingAmount || 0)}</div>
                <div className="stat-label">Хүлээгдэж буй дүн</div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}