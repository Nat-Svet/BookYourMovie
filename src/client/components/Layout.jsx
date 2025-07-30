import React from 'react';
import '../styles/Layout.css';  

export default function Layout({ children }) {
  return (
    <div className="layout">
      <main className="container py-4 no-padding"> 
        {children}
      </main>
    </div>
  );
}