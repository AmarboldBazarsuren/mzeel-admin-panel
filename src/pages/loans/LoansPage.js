// admin-panel/src/pages/loans/LoansPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate, getLoanStatusText, getLoanStatusColor } from '../../utils/formatters';
import './LoansPage.css';

export default function LoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadLoans();
  }, [page, statusFilter]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const response = await api.getAllLoans(page, statusFilter);

      if (response.success) {
        setLoans(response.data.loans);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Loans load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeVariant = (status) => {
    if (status === 'paid') return 'success';
    if (status === 'overdue') return 'danger';
    if (status === 'approved' || status === 'disbursed') return 'success';
    if (status === 'under_review' || status === 'pending_verification') return 'warning';
    if (status === 'cancelled') return 'default';
    return 'info';
  };

  const columns = [
    {
      header: 'Дугаар',
      field: 'loanNumber',
      width: '150px',
    },
    {
      header: 'Хэрэглэгч',
      field: 'user',
      render: (loan) => (
        <div>
          <div className="user-name-small">
            {loan.user?.lastName} {loan.user?.firstName}
          </div>
          <div className="user-phone-small">{loan.user?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Хүссэн дүн',
      field: 'requestedAmount',
      render: (loan) => formatCurrency(loan.requestedAmount || 0),
    },
    {
      header: 'Зөвшөөрсөн дүн',
      field: 'approvedAmount',
      render: (loan) => formatCurrency(loan.approvedAmount || 0),
    },
    {
      header: 'Олгосон дүн',
      field: 'disbursedAmount',
      render: (loan) => formatCurrency(loan.disbursedAmount || 0),
    },
    {
      header: 'Үлдэгдэл',
      field: 'remainingAmount',
      render: (loan) => (
        <span className="amount-highlight">
          {formatCurrency(loan.remainingAmount || 0)}
        </span>
      ),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (loan) => (
        <Badge variant={getBadgeVariant(loan.status)}>
          {getLoanStatusText(loan.status)}
        </Badge>
      ),
    },
    {
      header: 'Огноо',
      field: 'createdAt',
      render: (loan) => formatDate(loan.createdAt),
    },
  ];

  const statusOptions = [
    { value: '', label: 'Бүгд' },
    { value: 'pending_verification', label: 'Баталгаажуулалт' },
    { value: 'under_review', label: 'Шалгаж байна' },
    { value: 'approved', label: 'Зөвшөөрөгдсөн' },
    { value: 'disbursed', label: 'Олгогдсон' },
    { value: 'active', label: 'Идэвхтэй' },
    { value: 'paid', label: 'Төлөгдсөн' },
    { value: 'overdue', label: 'Хугацаа хэтэрсэн' },
  ];

  return (
    <div className="loans-page">
      <div className="page-header">
        <h1 className="page-heading">Зээлүүд</h1>
      </div>

      <div className="filters-section">
        <div className="status-filters">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-btn ${statusFilter === option.value ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter(option.value);
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
          <Table
            columns={columns}
            data={loans}
            onRowClick={(loan) => navigate(`/loans/${loan._id}`)}
          />

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