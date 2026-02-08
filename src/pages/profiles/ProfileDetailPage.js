// admin-panel/src/pages/profiles/ProfileDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import './ProfileDetailPage.css';

export default function ProfileDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Approve modal
  const [approveModal, setApproveModal] = useState(false);
  const [loanLimit, setLoanLimit] = useState('500000'); // Default 500k
  const [approveLoading, setApproveLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getProfileDetails(id);

      if (response.success) {
        setProfile(response.data.profile);
      }
    } catch (error) {
      console.error('Profile detail error:', error);
      alert('Алдаа гарлаа');
      navigate('/profiles/pending');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    const amount = parseInt(loanLimit);

    if (!amount || amount < 10000 || amount > 5000000) {
      alert('Зээлийн эрх 10,000₮ - 5,000,000₮ хооронд байх ёстой');
      return;
    }

    if (!window.confirm(`${amount.toLocaleString()}₮ зээлийн эрх өгөх үү?`)) return;

    try {
      setApproveLoading(true);
      const response = await api.verifyProfile(id, { loanLimit: amount });

      if (response.success) {
        alert('Profile амжилттай баталгаажлаа');
        setApproveModal(false);
        navigate('/profiles/pending');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Profile татгалзах уу?')) return;

    try {
      const response = await api.rejectProfile(id);

      if (response.success) {
        alert('Profile татгалзагдлаа');
        navigate('/profiles/pending');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert(error.message || 'Алдаа гарлаа');
    }
  };

  if (loading) {
    return <div className="loading">Ачааллаж байна...</div>;
  }

  return (
    <div className="profile-detail-page">
      <div className="page-header">
        <Button variant="ghost" onClick={() => navigate('/profiles/pending')}>
          ← Буцах
        </Button>
        <h1 className="page-heading">Profile дэлгэрэнгүй</h1>
      </div>

      <div className="detail-grid">
        {/* User Info */}
        <Card title="Хэрэглэгч">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Нэр</span>
              <span className="info-value">
                {profile.user?.lastName} {profile.user?.firstName}
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Утас</span>
              <span className="info-value">{profile.user?.phone}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{profile.user?.email}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Регистр</span>
              <span className="info-value">{profile.registerNumber}</span>
            </div>
          </div>
        </Card>

        {/* Bank Info */}
        <Card title="Банкны мэдээлэл">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Банк</span>
              <span className="info-value">{profile.bankAccount.bankName}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Дансны дугаар</span>
              <span className="info-value">{profile.bankAccount.accountNumber}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Эзэмшигч</span>
              <span className="info-value">{profile.bankAccount.accountName}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents - Зургууд */}
      <Card title="Баримт бичиг">
        <div className="documents-grid">
          <div className="document-item">
            <h4>Иргэний үнэмлэх (урд)</h4>
            {profile.idCardFront ? (
              <img src={profile.idCardFront} alt="ID Front" className="document-image" />
            ) : (
              <p>Байхгүй</p>
            )}
          </div>

          <div className="document-item">
            <h4>Иргэний үнэмлэх (ард)</h4>
            {profile.idCardBack ? (
              <img src={profile.idCardBack} alt="ID Back" className="document-image" />
            ) : (
              <p>Байхгүй</p>
            )}
          </div>

          <div className="document-item">
            <h4>Selfie зураг</h4>
            {profile.selfiePhoto ? (
              <img src={profile.selfiePhoto} alt="Selfie" className="document-image" />
            ) : (
              <p>Байхгүй</p>
            )}
          </div>
        </div>
      </Card>

      {/* Actions */}
      {!profile.isVerified && (
        <div className="actions-section">
          <Button variant="success" onClick={() => setApproveModal(true)}>
            ✓ Баталгаажуулах
          </Button>

          <Button variant="danger" onClick={handleReject}>
            ✕ Татгалзах
          </Button>
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={approveModal}
        onClose={() => setApproveModal(false)}
        title="Profile баталгаажуулах"
        footer={
          <>
            <Button variant="outline" onClick={() => setApproveModal(false)}>
              Болих
            </Button>
            <Button variant="success" onClick={handleApprove} loading={approveLoading}>
              Баталгаажуулах
            </Button>
          </>
        }
      >
        <p style={{ marginBottom: '16px', color: '#666' }}>
          Энэ хэрэглэгчид хэдэн төгрөгийн зээлийн эрх өгөх вэ?
        </p>

        <Input
          label="Зээлийн дээд эрх (₮)"
          type="number"
          value={loanLimit}
          onChange={(e) => setLoanLimit(e.target.value)}
          placeholder="500000"
          required
        />

        <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
          ℹ️ Жишээ: 500,000₮ гэвэл хэрэглэгч дээд тал нь 500,000₮ зээл авна
        </p>
      </Modal>
    </div>
  );
}