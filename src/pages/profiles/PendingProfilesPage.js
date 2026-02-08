// admin-panel/src/pages/profiles/PendingProfilesPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatters';
import './PendingProfilesPage.css';

export default function PendingProfilesPage() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadProfiles();
  }, [page]);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.getPendingProfiles(page);

      if (response.success) {
        setProfiles(response.data.profiles);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Profiles load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      header: 'Хэрэглэгч',
      field: 'user',
      render: (profile) => (
        <div>
          <div className="user-name-small">
            {profile.user?.lastName} {profile.user?.firstName}
          </div>
          <div className="user-phone-small">{profile.user?.phone}</div>
        </div>
      ),
    },
    {
      header: 'Регистр',
      field: 'registerNumber',
    },
    {
      header: 'Банк',
      field: 'bankAccount',
      render: (profile) => profile.bankAccount.bankName,
    },
    {
      header: 'Дансны дугаар',
      field: 'accountNumber',
      render: (profile) => profile.bankAccount.accountNumber,
    },
    {
      header: 'Огноо',
      field: 'createdAt',
      render: (profile) => formatDate(profile.createdAt),
    },
  ];

  return (
    <div className="pending-profiles-page">
      <div className="page-header">
        <h1 className="page-heading">Баталгаажуулалт хүлээгдэж буй Profile-үүд</h1>
      </div>

      {loading ? (
        <div className="loading">Ачааллаж байна...</div>
      ) : (
        <>
          <Table
            columns={columns}
            data={profiles}
            onRowClick={(profile) => navigate(`/profiles/${profile._id}`)}
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