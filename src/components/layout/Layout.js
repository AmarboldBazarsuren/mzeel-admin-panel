// admin-panel/src/components/layout/Layout.js

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      
      <div className="main-content">
        <Header />
        
        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}