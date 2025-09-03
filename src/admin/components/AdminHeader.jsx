import React from 'react';
import '../styles/AdminHeader.css';


const AdminHeader = () => {
    return (
        // чтобы задать css стили //
        <header className="admin_header">

            {/* Основной заголовок */}
            <h1 className="admin_header-title">
                {/* Слово "ИДЁМВКИНО", где "В" выделено другим стилем */}
                ИДЁМ<span className="admin_header-light">В</span>КИНО
            </h1>

            {/* Подзаголовок — пояснение, что это админка */}
            <div className="admin_header-subtitle">
                АДМИНИСТРАТОРРРСКАЯ
            </div>
        </header >

    );
};

export default AdminHeader;
