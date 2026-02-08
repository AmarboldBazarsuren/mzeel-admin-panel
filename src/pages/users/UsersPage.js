// admin-panel/src/pages/users/UsersPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { formatDate, formatPhone } from '../../utils/formatters';
import './UsersPage.css';

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers(page, search);

      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Users load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const columns = [
    {
      header: 'Хэрэглэгч',
      field: 'name',
      render: (user) => (
        <div className="user-cell">
          <div className="user-avatar-small">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </div>
          <div>
            <div className="user-name">{user.lastName} {user.firstName}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Утас',
      field: 'phone',
      render: (user) => formatPhone(user.phone),
    },
    {
      header: 'Эрх',
      field: 'role',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'danger' : 'default'}>
          {user.role === 'admin' ? 'Admin' : 'User'}
        </Badge>
      ),
    },
    {
      header: 'Төлөв',
      field: 'status',
      render: (user) => (
        <Badge variant={user.isActive ? 'success' : 'warning'}>
          {user.isActive ? 'Идэвхтэй' : 'Идэвхгүй'}
        </Badge>
      ),
    },
    {
      header: 'Баталгаажуулалт',
      field: 'verified',
      render: (user) => (
        <Badge variant={user.isVerified ? 'success' : 'default'}>
          {user.isVerified ? 'Тийм' : 'Үгүй'}
        </Badge>
      ),
    },
    {
      header: 'Бүртгэсэн',
      field: 'createdAt',
      render: (user) => formatDate(user.createdAt),
    },
  ];

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-heading">Хэрэглэгчид</h1>
      </div>

      <div className="filters-section">
        <Input
          placeholder="Нэр, имэйл, утсаар хайх..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="loading">Ачааллаж байна...</div>
      ) : (
        <>
          <Table
            columns={columns}
            data={users}
            onRowClick={(user) => navigate(`/users/${user._id}`)}
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