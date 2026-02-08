// admin-panel/src/pages/loans/LoanDetailPage.js - БҮРЭН ШИНЭЧИЛСЭН

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { formatCurrency, formatDate, getLoanStatusText, getLoanStatusColor } from '../../utils/formatters';
import './LoanDetailPage.css';

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approve modal
  const [approveModal, setApproveModal] = useState(false);
  const [approveAmount, setApproveAmount] = useState('');
  const [approveLoading, setApproveLoading] = useState(false);

  // Reject modal
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  // ✅ ШИНЭ: Disbursement action loading
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadLoan();
  }, [id]);

  const loadLoan = async () => {
    try {
      setLoading(true);
      const response = await api.getLoanDetails(id);

      if (response.success) {
        setLoan(response.data.loan);
        
        // Хэтэвчний мэдээлэл татах
        const walletRes = await api.getUserWallet(response.data.loan.user._id);
        if (walletRes.success) {
          setWallet(walletRes.data.wallet);
        }
        
        setApproveAmount(String(response.data.loan.requestedAmount || 100000));
      }
    } catch (error) {
      console.error('Loan detail error:', error);
      alert('Алдаа гарлаа');
      navigate('/loans');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const amount = parseInt(approveAmount);

    if (!amount || amount < 10000 || amount > 5000000) {
      alert('Зээлийн дүн 10,000₮ - 5,000,000₮ хооронд байх ёстой');
      return;
    }

    if (!window.confirm(`${formatCurrency(amount)} зээл зөвшөөрөх үү?`)) return;

    try {
      setApproveLoading(true);
      const response = await api.approveLoan(id, {
        approvedAmount: amount,
      });

      if (response.success) {
        alert('Зээл амжилттай зөвшөөрөгдлөө');
        setApproveModal(false);
        loadLoan();
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Татгалзах шалтгаанаа бичнэ үү');
      return;
    }

    if (!window.confirm('Зээл татгалзах уу?')) return;

    try {
      setRejectLoading(true);
      const response = await api.rejectLoan(id, {
        reason: rejectReason,
      });

      if (response.success) {
        alert('Зээл татгалзагдлаа');
        setRejectModal(false);
        loadLoan();
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setRejectLoading(false);
    }
  };

  // ✅ ШИНЭ: Зээл олгох (pending_disbursement -> disbursed)
  const handleApproveDisbursement = async () => {
    if (!window.confirm(`${formatCurrency(loan.approvedAmount)} зээл олгох уу?\n\nХэтэвчинд мөнгө шилжиж, зээлийн эрх багасна.`)) return;

    try {
      setActionLoading(true);
      const response = await api.approveLoanDisbursement(id);

      if (response.success) {
        alert('Зээл амжилттай олгогдлоо');
        loadLoan();
      }
    } catch (error) {
      console.error('Approve disbursement error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Ачааллаж байна...</div>;
  }

  const getBadgeVariant = (status) => {
    if (status === 'paid') return 'success';
    if (status === 'overdue') return 'danger';
    if (status === 'approved' || status === 'disbursed') return 'success';
    if (status === 'pending_disbursement') return 'info'; // ✅ ШИНЭ
    if (status === 'under_review' || status === 'pending_verification') return 'warning';
    return 'info';
  };

  const canApprove = loan.status === 'under_review';
  const canReject = ['pending_verification', 'under_review', 'approved'].includes(loan.status);
  const canApproveDisbursement = loan.status === 'pending_disbursement'; // ✅ ШИНЭ

  return (
    <div className="loan-detail-page">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate('/loans')}>
          ← Буцах
        </Button>
        <h1 className="page-heading">Зээлийн дэлгэрэнгүй</h1>
      </div>

      <div className="loan-header-section">
        <div>
          <h2 className="loan-number">{loan.loanNumber}</h2>
          <Badge variant={getBadgeVariant(loan.status)}>
            {getLoanStatusText(loan.status)}
          </Badge>
        </div>

        {/* ✅ ШИНЭЧИЛСЭН: Actions */}
        {(canApprove || canReject || canApproveDisbursement) && (
          <div className="header-actions">
            {canApproveDisbursement && (
              <Button 
                variant="success" 
                onClick={handleApproveDisbursement}
                loading={actionLoading}
              >
                💰 Зээл олгох
              </Button>
            )}
            {canApprove && (
              <Button variant="success" onClick={() => setApproveModal(true)}>
                ✓ Зөвшөөрөх
              </Button>
            )}
            {canReject && (
              <Button variant="danger" onClick={() => setRejectModal(true)}>
                ✕ Татгалзах
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="detail-grid">
        {/* User Info */}
        <Card title="Хэрэглэгч">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Нэр</span>
              <span className="info-value">
                {loan.user?.lastName} {loan.user?.firstName}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Утас</span>
              <span className="info-value">{loan.user?.phone}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{loan.user?.email}</span>
            </div>
          </div>
        </Card>

        {/* Хэтэвчний мэдээлэл */}
        {wallet && (
          <Card title="Хэтэвчний мэдээлэл">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Үлдэгдэл</span>
                <span className="info-value amount success">
                  {formatCurrency(wallet.balance)}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Нийт цэнэглэлт</span>
                <span className="info-value">
                  {formatCurrency(wallet.totalDeposit)}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Нийт зарцуулалт</span>
                <span className="info-value">
                  {formatCurrency(wallet.totalSpent || 0)}
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Loan Info */}
        <Card title="Зээлийн мэдээлэл">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Хүссэн дүн</span>
              <span className="info-value amount">
                {formatCurrency(loan.requestedAmount || 0)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Зөвшөөрсөн дүн</span>
              <span className="info-value amount">
                {formatCurrency(loan.approvedAmount || 0)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Олгосон дүн</span>
              <span className="info-value amount">
                {formatCurrency(loan.disbursedAmount || 0)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Нийт төлөх</span>
              <span className="info-value amount">
                {formatCurrency(loan.totalRepayment || 0)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Төлсөн</span>
              <span className="info-value amount success">
                {formatCurrency(loan.paidAmount || 0)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Үлдэгдэл</span>
              <span className="info-value amount danger">
                {formatCurrency(loan.remainingAmount || 0)}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Хүү</span>
              <span className="info-value">{loan.interestRate}%</span>
            </div>

            <div className="info-item">
              <span className="info-label">Хугацаа</span>
              <span className="info-value">{loan.term} хоног</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Dates */}
      <Card title="Огнооны мэдээлэл">
        <div className="dates-grid">
          <div className="date-item">
            <span className="date-label">Үүссэн</span>
            <span className="date-value">{formatDate(loan.createdAt)}</span>
          </div>

          {loan.verificationPaidAt && (
            <div className="date-item">
              <span className="date-label">Баталгаажуулалт төлсөн</span>
              <span className="date-value">{formatDate(loan.verificationPaidAt)}</span>
            </div>
          )}

          {loan.approvedAt && (
            <div className="date-item">
              <span className="date-label">Зөвшөөрөгдсөн</span>
              <span className="date-value">{formatDate(loan.approvedAt)}</span>
            </div>
          )}

          {loan.approvedBy && (
            <div className="date-item">
              <span className="date-label">Зөвшөөрсөн</span>
              <span className="date-value">
                {loan.approvedBy.lastName} {loan.approvedBy.firstName}
              </span>
            </div>
          )}

          {loan.disbursedAt && (
            <div className="date-item">
              <span className="date-label">Олгогдсон</span>
              <span className="date-value">{formatDate(loan.disbursedAt)}</span>
            </div>
          )}

          {loan.dueDate && (
            <div className="date-item">
              <span className="date-label">Төлөх хугацаа</span>
              <span className="date-value">{formatDate(loan.dueDate)}</span>
            </div>
          )}

          {loan.paidAt && (
            <div className="date-item">
              <span className="date-label">Төлөгдсөн</span>
              <span className="date-value">{formatDate(loan.paidAt)}</span>
            </div>
          )}
        </div>

        {loan.adminNotes && (
          <div className="admin-notes">
            <strong>Admin тайлбар:</strong> {loan.adminNotes}
          </div>
        )}

        {loan.rejectionReason && (
          <div className="rejection-reason">
            <strong>Татгалзсан шалтгаан:</strong> {loan.rejectionReason}
          </div>
        )}
      </Card>

      {/* Approve Modal */}
      <Modal
        isOpen={approveModal}
        onClose={() => setApproveModal(false)}
        title="Зээл зөвшөөрөх"
        footer={
          <>
            <Button variant="outline" onClick={() => setApproveModal(false)}>
              Болих
            </Button>
            <Button variant="success" onClick={handleApprove} loading={approveLoading}>
              Зөвшөөрөх
            </Button>
          </>
        }
      >
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Зээлийн дүнгээ оруулна уу. Хэрэглэгч энэ дүнг олж авна.
        </p>

        <Input
          label="Зөвшөөрөх дүн (₮)"
          type="number"
          value={approveAmount}
          onChange={(e) => setApproveAmount(e.target.value)}
          placeholder="100000"
          required
        />

        <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
          ℹ️ Хамгийн багадаа 10,000₮, хамгийн ихдээ 5,000,000₮
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Зээл татгалзах"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectModal(false)}>
              Болих
            </Button>
            <Button variant="danger" onClick={handleReject} loading={rejectLoading}>
              Татгалзах
            </Button>
          </>
        }
      >
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Татгалзах шалтгаанаа бичнэ үү
        </p>

        <Input
          label="Шалтгаан"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Шалтгаанаа бичнэ үү..."
          required
        />
      </Modal>
    </div>
  );
}