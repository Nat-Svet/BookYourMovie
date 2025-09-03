import React from 'react';
import { Outlet } from 'react-router-dom'; //он уже не нужен, надо убрать после финальной проверки //
import '../styles/Layout.css';


export default function Layout({ children }) {
  return (
    // Основной контейнер с классом layout //
    <div className="layout">
      <div className="layout__overlay" /> {/*это тоже  нужно убрать после финальной проверки */}
      {/* Основной контент страницы */}
      <main className="container py-4 no-padding">
        {/* Здесь отображаются переданные дочерние компоненты */}
        {children}
      </main>
    </div>
  );
}





