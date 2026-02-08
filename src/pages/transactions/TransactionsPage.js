// admin-panel/src/pages/transactions/TransactionsPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './TransactionsPage.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [page, typeFilter]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.getAllTransactions(page, typeFilter);

      if (response.success) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Transactions load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (status) => {
    if (status === 'completed') return 'success';
    if (status === 'failed' || status === 'cancelled') return 'danger';
    if (status === 'pending') return 'warning';
    return 'info';
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Хүлээгдэж байна',
      completed: 'Амжилттай',
      failed: 'Амжилтгүй',
      cancelled: 'Цуцлагдсан',
    };
    return map[status] || status;
  };

  const getTypeText = (type) => {
    const map = {
      deposit: 'Цэнэглэлт',
      withdrawal: 'Татах',
      loan_disbursement: 'Зээл олгох',
      loan_payment: 'Зээл төлөлт',
      verification_fee: 'Баталгаажуулалт',
      refund: 'Буцаалт',
    };
    return map[type] || type;
  };

  const getTypeIcon = (type) => {
    const map = {
      deposit: '⬇️',
      withdrawal: '⬆️',
      loan_disbursement: '💳',
      loan_payment: '💰',
      verification_fee: '✓',
      refund: '↩️',
    };
    return map[type] || '📝';
  };

  const columns = [
    {
      header: 'Төрөл',
      field: 'type',
      width: '180px',
      render: (tx) => (
        <div className="type-cell">
          <span className="type-icon">{getTypeIcon(tx.type)}</span>
          <span>{getTypeText(tx.type)}</span>
        </div>
      ),
    },
    {
      header: 'Хэрэглэгч',
      field: 'user',
      render: (tx) => (
        <div>
          <div className="user-name-small">
            {tx.user?.lastName} {tx.user?.firstName}
          </div>
          <div className="user-phone-small">{tx.user?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Дүн',
      field: 'amount',
      render: (tx) => {
        const isIncome = ['deposit', 'loan_disbursement', 'refund'].includes(tx.type);
        return (
          <span className={isIncome ? 'amount-positive' : 'amount-negative'}>
            {isIncome ? '+' : '-'}
            {formatCurrency(tx.amount)}
          </span>
        );
      },
    },
    {
      header: 'Өмнөх үлдэгдэл',
      field: 'balanceBefore',
      render: (tx) => formatCurrency(tx.balanceBefore || 0),
    },
    {
      header: 'Дараах үлдэгдэл',
      field: 'balanceAfter',
      render: (tx) => formatCurrency(tx.balanceAfter || 0),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (tx) => (
        <Badge variant={getBadgeVariant(tx.status)}>
          {getStatusText(tx.status)}
        </Badge>
      ),
    },
    {
      header: 'Тайлбар',
      field: 'description',
      render: (tx) => (
        <span className="description-text">{tx.description || '-'}</span>
      ),
    },
    {
      header: 'Огноо',
      field: 'createdAt',
      render: (tx) => formatDate(tx.createdAt),
    },
  ];

  const typeOptions = [
    { value: '', label: 'Бүгд' },
    { value: 'deposit', label: 'Цэнэглэлт' },
    { value: 'withdrawal', label: 'Татах' },
    { value: 'loan_disbursement', label: 'Зээл олгох' },
    { value: 'loan_payment', label: 'Зээл төлөлт' },
    { value: 'verification_fee', label: 'Баталгаажуулалт' },
  ];

  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1 className="page-heading">Гүйлгээ</h1>
      </div>

      <div className="filters-section">
        <div className="status-filters">
          {typeOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${typeFilter === option.value ? 'active' : ''}`}
              onClick={() => {
                setTypeFilter(option.value);
                setPage(1);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="loading">Ачааллаж байна...</div>
      ) : (
        <>
          <Table columns={columns} data={transactions} />

          {pagination && pagination.pages > 1 && (
            <div className="pagination">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Өмнөх
              </Button>

              <span className="page-info">
                {page} / {pagination.pages}
              </span>

              <Button
                variant="outline"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Дараах →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}