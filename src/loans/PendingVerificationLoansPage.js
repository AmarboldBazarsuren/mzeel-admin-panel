// admin-panel/src/pages/loans/PendingVerificationLoansPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './PendingVerificationLoansPage.css';

export default function PendingVerificationLoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadLoans();
  }, [page]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const response = await api.getPendingVerificationLoans(page);

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

  const handleStartReview = async (loanId) => {
    if (!window.confirm('Зээлийн шалгалт эхлүүлэх үү?')) return;

    try {
      const response = await api.startLoanReview(loanId);

      if (response.success) {
        alert('Шалгалт эхэллээ');
        loadLoans();
      }
    } catch (error) {
      alert(error.message || 'Алдаа гарлаа');
    }
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
      header: 'Баталгаажуулалтын төлбөр',
      field: 'verificationFee',
      render: (loan) => formatCurrency(loan.verificationFee),
    },
    {
      header: 'Төлсөн огноо',
      field: 'verificationPaidAt',
      render: (loan) => formatDate(loan.verificationPaidAt),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (loan) => (
        <Badge variant="warning">Хүлээгдэж байна</Badge>
      ),
    },
    {
      header: '',
      field: 'actions',
      width: '150px',
      render: (loan) => (
        <Button size="small" onClick={() => handleStartReview(loan._id)}>
          Шалгалт эхлүүлэх
        </Button>
      ),
    },
  ];

  return (
    <div className="pending-verification-loans-page">
      <div className="page-header">
        <h1 className="page-heading">Зээлийн мэдээлэл шалгуулах хүсэлтүүд</h1>
        <p className="page-subtitle">3,000₮ төлсөн хэрэглэгчид</p>
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