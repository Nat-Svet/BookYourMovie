import React, { useState } from 'react';
import ManageHalls from '../components/ManageHalls';
import ConfigHalls from '../components/ConfigHalls';
import ConfigPrices from '../components/ConfigPrices';
import Sessions from '../components/Sessions';
import OpenSale from '../components/OpenSale';
import AdminLayout from '../components/AdminLayout';
import AdminHeader from '../components/AdminHeader';

import '../styles/AdminPage.css';

const AdminPage = () => {
    const [halls, setHalls] = useState([
        { id: 1, name: 'ЗАЛ 1' },
        { id: 2, name: 'ЗАЛ 2' },
    ]);

    const addHall = (hallName) => {
        const newId = halls.length ? Math.max(...halls.map(h => h.id)) + 1 : 1;
        setHalls([...halls, { id: newId, name: hallName }]);
    };

    const deleteHall = (id) => {
        setHalls(halls.filter(h => h.id !== id));
    };

    return (
        <AdminLayout>

            <AdminHeader />

            <div className="admin-page-wrapper">

                <ManageHalls halls={halls} addHall={addHall} deleteHall={deleteHall} />
                <ConfigHalls halls={halls} />
                <ConfigPrices halls={halls} />
                <Sessions halls={halls} />
                <OpenSale halls={halls} />

            </div>


        </AdminLayout>
    );
};

export default AdminPage;
