// admin-panel/src/components/layout/Sidebar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/users', icon: '👥', label: 'Хэрэглэгчид' },
    { path: '/profiles/pending', icon: '📋', label: 'Profile шалгах' },
    { path: '/loans/verification', icon: '💳', label: 'Зээл шалгуулах' },
    { path: '/loans', icon: '💰', label: 'Зээлүүд' },
    { path: '/withdrawals', icon: '💸', label: 'Татах хүсэлт' },
    { path: '/transactions', icon: '📝', label: 'Гүйлгээ' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">M</div>
          <span className="logo-text">credit Admin</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}