// src/admin/pages/AdminPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import ManageHalls from '../components/ManageHalls';
import ConfigHalls from '../components/ConfigHalls';
import ConfigPrices from '../components/ConfigPrices';
import Sessions from '../components/Sessions';
import OpenSale from '../components/OpenSale';
import AdminLayout from '../components/AdminLayout';
import AdminHeader from '../components/AdminHeader';
import '../styles/AdminPage.css';
import API from '../../api/api';

const api = new API();

const AdminPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHalls = useCallback(async () => {
    try {
      const data = await api.getAllData(); // ✅ теперь /alldata
      const hallsList = Array.isArray(data.halls) ? data.halls : Array.isArray(data) ? data : [];
      const filtered = hallsList.filter(h => h.hall_name && !h.hall_name.startsWith('temp-'));
      setHalls(filtered);
    } catch (err) {
      console.error('❌ Ошибка загрузки залов:', err);
      alert('Ошибка при загрузке залов: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  const addHall = async (hallName) => {
    try {
      await api.createHall({ hallName });
      await fetchHalls(); // ✅ сразу перезагружаем общий список
    } catch (err) {
      console.error('❌ Ошибка при добавлении зала:', err);
      alert(err?.message || 'Ошибка при добавлении зала');
    }
  };

  const deleteHall = async (hallId) => {
    const confirmDelete = window.confirm('Удалить этот зал? Сеансы будут удалены тоже!');
    if (!confirmDelete) return;

    try {
      await api.deleteHall(hallId);
      await fetchHalls(); // ✅ сразу перезагружаем общий список
    } catch (err) {
      console.error('❌ Ошибка при удалении зала:', err);
      alert(err?.message || 'Ошибка при удалении зала');
    }
  };

  return (
    <AdminLayout>
      <AdminHeader />
      <div className="admin-page-wrapper">
        {loading ? (
          <p>Загрузка залов...</p>
        ) : (
          <>
            <ManageHalls
              halls={halls}
              onAddHall={addHall}
              onDeleteHall={deleteHall}
            />
            <ConfigHalls halls={halls} />
            <ConfigPrices halls={halls} />
            <Sessions halls={halls} />
            <OpenSale halls={halls} />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
