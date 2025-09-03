import React from 'react';
import '../styles/AdminLayout.css';

// принимает вложенный контент (children) //
export default function AdminLayout({ children }) {
  return (
    // Вся обёртка макета, применяем стили через класс admin_layout //
    <div className="admin_layout">
      {/* Полупрозрачный оверлей */}
      <div className="admin_layout__overlay" />
      {/* Основная часть страницы, в неё подставляется контент из children */}
      <main className="admin_container py-4 no-padding">
        {children} {/* Контент, который будет внутри макета */}
      </main>
    </div>
  );
}
