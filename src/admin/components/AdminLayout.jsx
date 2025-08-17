import React from 'react';
import '../styles/AdminLayout.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin_layout">
      <div className="admin_layout__overlay" />
      <main className="admin_container py-4 no-padding">
        {children}
      </main>
    </div>
  );
}
