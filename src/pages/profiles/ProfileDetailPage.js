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
  const [approveLoading, setApproveLoading] = useState(false);

  // Reject modal
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

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
    if (!window.confirm('Profile баталгаажуулах уу?')) return;

    try {
      setApproveLoading(true);
      const response = await api.verifyProfile(id);

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
    if (!rejectReason.trim()) {
      alert('Татгалзах шалтгаанаа бичнэ үү');
      return;
    }

    if (!window.confirm('Profile татгалзах уу?')) return;

    try {
      setRejectLoading(true);
      const response = await api.rejectProfile(id, { reason: rejectReason });

      if (response.success) {
        alert('Profile татгалзагдлаа');
        setRejectModal(false);
        navigate('/profiles/pending');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert(error.message || 'Алдаа гарлаа');
    } finally {
      setRejectLoading(false);
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

            <div className="info-item">
              <span className="info-label">Төрсөн өдөр</span>
              <span className="info-value">{formatDate(profile.dateOfBirth)}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Хүйс</span>
              <span className="info-value">
                {profile.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
              </span>
            </div>
          </div>
        </Card>

        {/* Address */}
        <Card title="Гэрийн хаяг">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Хот/Аймаг</span>
              <span className="info-value">{profile.address.city}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Дүүрэг/Сум</span>
              <span className="info-value">{profile.address.district}</span>
            </div>

            {profile.address.khoroo && (
              <div className="info-item">
                <span className="info-label">Хороо</span>
                <span className="info-value">{profile.address.khoroo}</span>
              </div>
            )}

            {profile.address.street && (
              <div className="info-item">
                <span className="info-label">Гудамж</span>
                <span className="info-value">{profile.address.street}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card title="Яаралтай холбоо барих">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Нэр</span>
            <span className="info-value">{profile.emergencyContact.name}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Хамаарал</span>
            <span className="info-value">{profile.emergencyContact.relationship}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Утас</span>
            <span className="info-value">{profile.emergencyContact.phone}</span>
          </div>
        </div>
      </Card>

      {/* Employment */}
      {profile.employment && (
        <Card title="Ажлын мэдээлэл">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Төлөв</span>
              <span className="info-value">
                {profile.employment.status === 'employed' ? 'Ажилтай' :
                 profile.employment.status === 'self-employed' ? 'Хувиараа' :
                 profile.employment.status === 'student' ? 'Оюутан' : 'Ажилгүй'}
              </span>
            </div>

            {profile.employment.companyName && (
              <div className="info-item">
                <span className="info-label">Байгууллага</span>
                <span className="info-value">{profile.employment.companyName}</span>
              </div>
            )}

            {profile.employment.position && (
              <div className="info-item">
                <span className="info-label">Албан тушаал</span>
                <span className="info-value">{profile.employment.position}</span>
              </div>
            )}

            {profile.employment.monthlyIncome > 0 && (
              <div className="info-item">
                <span className="info-label">Сарын орлого</span>
                <span className="info-value">
                  {profile.employment.monthlyIncome.toLocaleString()}₮
                </span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Bank Account */}
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

          <Button variant="danger" onClick={() => setRejectModal(true)}>
            ✕ Татгалзах
          </Button>
        </div>
      )}

      {profile.isVerified && (
        <Card>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Badge variant="success">Баталгаажсан</Badge>
            {profile.verifiedAt && (
              <p style={{ marginTop: '8px', color: '#666' }}>
                {formatDate(profile.verifiedAt)}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Approve Modal - Simplified */}
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
        <p style={{ color: '#666' }}>
          Энэ хэрэглэгчийн profile-ийг баталгаажуулах уу?
          <br /><br />
          Баталгаажуулсны дараа тэр зээлийн мэдээлэл шалгуулах боломжтой болно.
        </p>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        title="Profile татгалзах"
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
          Татгалзах шалтгаанаа бичнэ үү (хэрэглэгчид харагдана)
        </p>

        <Input
          label="Шалтгаан"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Жишээ: Регистрийн дугаар буруу, зураг тодорхойгүй гэх мэт..."
          required
        />
      </Modal>
    </div>
  );
}