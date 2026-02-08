// admin-panel/src/components/layout/Header.js

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import './Header.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="page-title">Admin Panel</h1>
      </div>

      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.lastName} {user?.firstName}</div>
            <div className="user-role">Admin</div>
          </div>
        </div>

        <Button variant="ghost" size="small" onClick={logout}>
          🚪 Гарах
        </Button>
      </div>
    </header>
  );
}