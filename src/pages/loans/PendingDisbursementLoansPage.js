// admin-panel/src/pages/loans/PendingDisbursementLoansPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import './LoansPage.css';

export default function PendingDisbursementLoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    loadLoans();
  }, [pagination.page]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const response = await api.getPendingDisbursementLoans(pagination.page);
      
      if (response.success) {
        setLoans(response.data.loans);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Зээл татахад алдаа:', error);
      alert('Зээл татахад алдаа гарлаа');
    } finally {
      setLoading(false);
    }
  };

  const handleViewLoan = (loanId) => {
    navigate(`/loans/${loanId}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0
    }).replace('MNT', '₮');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('mn-MN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loans-page">
        <div className="page-header">
          <h1>🏦 Зээл авах хүсэлт</h1>
        </div>
        <div className="loading">Ачааллаж байна...</div>
      </div>
    );
  }

  return (
    <div className="loans-page">
      <div className="page-header">
        <h1>🏦 Зээл авах хүсэлт</h1>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-label">Нийт хүсэлт:</span>
            <span className="stat-value">{pagination.total}</span>
          </div>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="empty-state">
          <p>Зээл авах хүсэлт байхгүй байна</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Зээлийн дугаар</th>
                  <th>Хэрэглэгч</th>
                  <th>Утас</th>
                  <th>Зээлийн дүн</th>
                  <th>Хүү</th>
                  <th>Хугацаа</th>
                  <th>Хүсэлт илгээсэн</th>
                  <th>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>
                      <strong>{loan.loanNumber}</strong>
                    </td>
                    <td>
                      {loan.user?.firstName} {loan.user?.lastName}
                    </td>
                    <td>{loan.user?.phone}</td>
                    <td>
                      <strong className="amount-primary">
                        {formatCurrency(loan.approvedAmount)}
                      </strong>
                    </td>
                    <td>{loan.interestRate}%</td>
                    <td>{loan.term} хоног</td>
                    <td className="date-small">
                      {formatDate(loan.createdAt)}
                    </td>
                    <td>
                      <button
                        className="btn-view"
                        onClick={() => handleViewLoan(loan._id)}
                      >
                        Дэлгэрэнгүй
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              >
                Өмнөх
              </button>
              <span>
                Хуудас {pagination.page} / {pagination.pages}
              </span>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              >
                Дараах
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}