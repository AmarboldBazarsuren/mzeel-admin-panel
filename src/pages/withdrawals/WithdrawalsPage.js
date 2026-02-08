// admin-panel/src/pages/withdrawals/WithdrawalsPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './WithdrawalsPage.css';

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Detail Modal
  const [detailModal, setDetailModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  // Approve/Reject
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadWithdrawals();
  }, [page, statusFilter]);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await api.getAllWithdrawals(page, statusFilter);

      if (response.success) {
        setWithdrawals(response.data.withdrawals);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Withdrawals load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setDetailModal(true);
    setAdminNotes('');
    setRejectReason('');
  };

  const handleApprove = async () => {
    if (!window.confirm('Татах хүсэлт зөвшөөрөх үү?')) return;

    try {
      setActionLoading(true);
      const response = await api.approveWithdrawal(selectedWithdrawal._id, {
        notes: adminNotes,
      });

      if (response.success) {
        alert('Амжилттай зөвшөөрөгдлөө');
        setDetailModal(false);
        loadWithdrawals();
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Татгалзах шалтгаанаа бичнэ үү');
      return;
    }

    if (!window.confirm('Татах хүсэлт татгалзах уу?')) return;

    try {
      setActionLoading(true);
      const response = await api.rejectWithdrawal(selectedWithdrawal._id, {
        reason: rejectReason,
      });

      if (response.success) {
        alert('Татгалзагдлаа');
        setDetailModal(false);
        loadWithdrawals();
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setActionLoading(false);
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
      processing: 'Боловсруулж байна',
      completed: 'Амжилттай',
      failed: 'Амжилтгүй',
      cancelled: 'Цуцлагдсан',
    };
    return map[status] || status;
  };

  const columns = [
    {
      header: 'Хэрэглэгч',
      field: 'user',
      render: (w) => (
        <div>
          <div className="user-name-small">
            {w.user?.lastName} {w.user?.firstName}
          </div>
          <div className="user-phone-small">{w.user?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Дүн',
      field: 'amount',
      render: (w) => (
        <span className="amount-highlight">
          {formatCurrency(w.totalAmount || w.amount)}
        </span>
      ),
    },
    {
      header: 'Банк',
      field: 'bankName',
    },
    {
      header: 'Дансны дугаар',
      field: 'accountNumber',
    },
    {
      header: 'Эзэмшигч',
      field: 'accountName',
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (w) => (
        <Badge variant={getBadgeVariant(w.status)}>
          {getStatusText(w.status)}
        </Badge>
      ),
    },
    {
      header: 'Огноо',
      field: 'createdAt',
      render: (w) => formatDate(w.createdAt),
    },
    {
      header: '',
      field: 'actions',
      width: '100px',
      render: (w) => (
        <Button size="small" onClick={() => openDetail(w)}>
          Харах
        </Button>
      ),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Хүлээгдэж байгаа' },
    { value: 'completed', label: 'Амжилттай' },
    { value: 'failed', label: 'Амжилтгүй' },
    { value: '', label: 'Бүгд' },
  ];

  return (
    <div className="withdrawals-page">
      <div className="page-header">
        <h1 className="page-heading">Татах хүсэлтүүд</h1>
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
          <Table columns={columns} data={withdrawals} />

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

      {/* Detail Modal */}
      {selectedWithdrawal && (
        <Modal
          isOpen={detailModal}
          onClose={() => setDetailModal(false)}
          title="Татах хүсэлтийн дэлгэрэнгүй"
          size="medium"
        >
          <div className="withdrawal-detail">
            <div className="detail-section">
              <h3>Хэрэглэгч</h3>
              <p>
                <strong>Нэр:</strong> {selectedWithdrawal.user?.lastName}{' '}
                {selectedWithdrawal.user?.firstName}
              </p>
              <p>
                <strong>Утас:</strong> {selectedWithdrawal.user?.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedWithdrawal.user?.email}
              </p>
            </div>

            <div className="detail-section">
              <h3>Мөнгөн мэдээлэл</h3>
              <p>
                <strong>Дүн:</strong> {formatCurrency(selectedWithdrawal.amount)}
              </p>
              <p>
                <strong>Шимтгэл:</strong> {formatCurrency(selectedWithdrawal.fee || 0)}
              </p>
              <p>
                <strong>Нийт:</strong> {formatCurrency(selectedWithdrawal.totalAmount)}
              </p>
            </div>

            <div className="detail-section">
              <h3>Банкны мэдээлэл</h3>
              <p>
                <strong>Банк:</strong> {selectedWithdrawal.bankName}
              </p>
              <p>
                <strong>Дансны дугаар:</strong> {selectedWithdrawal.accountNumber}
              </p>
              <p>
                <strong>Эзэмшигч:</strong> {selectedWithdrawal.accountName}
              </p>
            </div>

            <div className="detail-section">
              <h3>Төлөв</h3>
              <p>
                <Badge variant={getBadgeVariant(selectedWithdrawal.status)}>
                  {getStatusText(selectedWithdrawal.status)}
                </Badge>
              </p>
              <p>
                <strong>Үүссэн:</strong> {formatDate(selectedWithdrawal.createdAt)}
              </p>
              {selectedWithdrawal.processedAt && (
                <p>
                  <strong>Боловсруулсан:</strong>{' '}
                  {formatDate(selectedWithdrawal.processedAt)}
                </p>
              )}
            </div>

            {selectedWithdrawal.status === 'pending' && (
              <>
                <div className="detail-section">
                  <Input
                    label="Admin тайлбар (заавал биш)"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Тайлбар..."
                  />
                </div>

                <div className="modal-actions">
                  <Button
                    variant="success"
                    onClick={handleApprove}
                    loading={actionLoading}
                  >
                    ✓ Зөвшөөрөх
                  </Button>

                  <Button variant="outline" onClick={() => setDetailModal(false)}>
                    Болих
                  </Button>
                </div>

                <div className="detail-section">
                  <Input
                    label="Татгалзах шалтгаан"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Шалтгаан..."
                  />

                  <Button
                    variant="danger"
                    onClick={handleReject}
                    loading={actionLoading}
                    style={{ marginTop: '12px' }}
                  >
                    ✕ Татгалзах
                  </Button>
                </div>
              </>
            )}

            {selectedWithdrawal.adminNotes && (
              <div className="detail-section">
                <h3>Admin тайлбар</h3>
                <p>{selectedWithdrawal.adminNotes}</p>
              </div>
            )}

            {selectedWithdrawal.failureReason && (
              <div className="detail-section error-section">
                <h3>Татгалзсан шалтгаан</h3>
                <p>{selectedWithdrawal.failureReason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}