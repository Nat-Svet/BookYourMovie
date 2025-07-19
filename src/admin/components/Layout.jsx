import React from 'react';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__title">Идём<span className="layout__title__special">в</span>кино</h1>
      </header>
      <main className="layout__content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
