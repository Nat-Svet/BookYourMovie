import React from 'react';
import '../styles/AdminHeader.css';


const AdminHeader = () => {
    return (
        <header className="admin_header">
            <h1 className="admin_header-title">
                ИДЁМ<span className="admin_header-light">В</span>КИНО
            </h1>

            <div className="admin_header-subtitle">
                АДМИНИСТРАТОРРРСКАЯ
            </div>
        </header >

    );
};

export default AdminHeader;
