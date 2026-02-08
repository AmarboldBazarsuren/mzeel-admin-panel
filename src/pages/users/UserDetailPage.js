// admin-panel/src/pages/users/UserDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import { formatCurrency, formatDate, formatPhone } from '../../utils/formatters';
import './UserDetailPage.css';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [id]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getUserDetails(id);

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('User details error:', error);
      alert('Алдаа гарлаа');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!window.confirm('Төлөв өөрчлөх үү?')) return;

    try {
      setToggling(true);
      const response = await api.toggleUserStatus(id);

      if (response.success) {
        alert('Амжилттай өөрчлөгдлөө');
        loadUserDetails();
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Алдаа гарлаа');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return <div className="loading">Ачааллаж байна...</div>;
  }

  const { user, wallet, loans, transactions } = data;

  const loanColumns = [
    {
      header: 'Дугаар',
      field: 'loanNumber',
    },
    {
      header: 'Дүн',
      field: 'amount',
      render: (loan) => formatCurrency(loan.disbursedAmount || loan.approvedAmount || 0),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (loan) => (
        <Badge variant={loan.status === 'paid' ? 'success' : 'warning'}>
          {loan.status}
        </Badge>
      ),
    },
    {
      header: 'Огноо',
      field: 'createdAt',
      render: (loan) => formatDate(loan.createdAt),
    },
  ];

  const transactionColumns = [
    {
      header: 'Төрөл',
      field: 'type',
    },
    {
      header: 'Дүн',
      field: 'amount',
      render: (tx) => formatCurrency(tx.amount),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (tx) => (
        <Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>
          {tx.status}
        </Badge>
      ),
    },
    {
      header: 'Огноо',
      field: 'createdAt',
      render: (tx) => formatDate(tx.createdAt),
    },
  ];

  return (
    <div className="user-detail-page">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate('/users')}>
          ← Буцах
        </Button>
        <h1 className="page-heading">Хэрэглэгчийн дэлгэрэнгүй</h1>
      </div>

      <div className="detail-grid">
        {/* User Info */}
        <Card title="Хувийн мэдээлэл">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Нэр</span>
              <span className="info-value">{user.lastName} {user.firstName}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Утас</span>
              <span className="info-value">{formatPhone(user.phone)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Эрх</span>
              <Badge variant={user.role === 'admin' ? 'danger' : 'default'}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </div>

            <div className="info-item">
              <span className="info-label">Төлөв</span>
              <Badge variant={user.isActive ? 'success' : 'warning'}>
                {user.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
              </Badge>
            </div>

            <div className="info-item">
              <span className="info-label">Баталгаажуулалт</span>
              <Badge variant={user.isVerified ? 'success' : 'default'}>
                {user.isVerified ? 'Тийм' : 'Үгүй'}
              </Badge>
            </div>

            <div className="info-item">
              <span className="info-label">Бүртгэсэн</span>
              <span className="info-value">{formatDate(user.createdAt)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Сүүлд нэвтэрсэн</span>
              <span className="info-value">
                {user.lastLogin ? formatDate(user.lastLogin) : 'Байхгүй'}
              </span>
            </div>
          </div>

          <div className="actions">
            <Button
              variant={user.isActive ? 'danger' : 'success'}
              onClick={handleToggleStatus}
              loading={toggling}
            >
              {user.isActive ? 'Идэвхгүй болгох' : 'Идэвхжүүлэх'}
            </Button>
          </div>
        </Card>

        {/* Wallet */}
        {wallet && (
          <Card title="Хэтэвч">
            <div className="wallet-stats">
              <div className="wallet-stat">
                <div className="wallet-label">Үлдэгдэл</div>
                <div className="wallet-value">{formatCurrency(wallet.balance)}</div>
              </div>

              <div className="wallet-stat">
                <div className="wallet-label">Нийт цэнэглэлт</div>
                <div className="wallet-value">{formatCurrency(wallet.totalDeposit)}</div>
              </div>

              <div className="wallet-stat">
                <div className="wallet-label">Нийт зарцуулалт</div>
                <div className="wallet-value">{formatCurrency(wallet.totalSpent || 0)}</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Loans */}
      {loans && loans.length > 0 && (
        <div className="section">
          <h2 className="section-heading">Сүүлийн 5 зээл</h2>
          <Table columns={loanColumns} data={loans} />
        </div>
      )}

      {/* Transactions */}
      {transactions && transactions.length > 0 && (
        <div className="section">
          <h2 className="section-heading">Сүүлийн 10 гүйлгээ</h2>
          <Table columns={transactionColumns} data={transactions} />
        </div>
      )}
    </div>
  );
}