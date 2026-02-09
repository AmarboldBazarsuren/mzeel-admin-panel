// admin-panel/src/pages/loans/PendingDisbursementLoansPage.js

import React, { useState, useEffect, useCallback } from 'react'; // ✅ useCallback нэмсэн
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './PendingVerificationLoansPage.css';

export default function PendingDisbursementLoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // ✅ ЗАСВАРЛАСАН: useCallback ашигласан
  const loadLoans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getPendingDisbursementLoans(page);

      if (response.success) {
        setLoans(response.data.loans);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Loans load error:', error);
    } finally {
      setLoading(false);
    }
  }, [page]); // ✅ page-ээс хамааралтай

  useEffect(() => {
    loadLoans();
  }, [loadLoans]); // ✅ loadLoans-г dependency-д нэмсэн

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
      render: (loan) => formatCurrency(loan.requestedAmount),
    },
    {
      header: 'Зөвшөөрсөн дүн',
      field: 'approvedAmount',
      render: (loan) => formatCurrency(loan.approvedAmount),
    },
    {
      header: 'Үүссэн огноо',
      field: 'createdAt',
      render: (loan) => formatDate(loan.createdAt),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: () => (
        <Badge variant="info">Зээл олгох хүлээгдэж байна</Badge>
      ),
    },
    {
      header: '',
      field: 'actions',
      width: '120px',
      render: (loan) => (
        <Button size="small" onClick={() => navigate(`/loans/${loan._id}`)}>
          Дэлгэрэнгүй
        </Button>
      ),
    },
  ];

  return (
    <div className="pending-verification-loans-page">
      <div className="page-header">
        <h1 className="page-heading">Зээл авах хүсэлтүүд</h1>
        <p className="page-subtitle">Хэрэглэгчид зээл авах хүсэлт илгээсэн</p>
      </div>

      {loading ? (
        <div className="loading">Ачааллаж байна...</div>
      ) : (
        <>
          <Table columns={columns} data={loans} />

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