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
  const [hallStates, setHallStates] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchHalls = useCallback(async () => {
    try {
      const data = await api.getAllData();
      const hallsList = Array.isArray(data.halls) ? data.halls : Array.isArray(data) ? data : [];

      const filtered = hallsList.filter(h => h.hall_name && !h.hall_name.startsWith('temp-'));
      setHalls(filtered);

      // Загружаем сохранённые состояния из localStorage
      const stored = localStorage.getItem("hallStates");
      const savedStates = stored ? JSON.parse(stored) : {};

      const newStates = {};
      filtered.forEach(h => {
        newStates[h.hall_name] = savedStates[h.hall_name] || false;
      });

      setHallStates(newStates);
    } catch (err) {
      console.error('Ошибка загрузки залов:', err);
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
      await fetchHalls();
    } catch (err) {
      console.error('Ошибка при добавлении зала:', err);
      alert(err?.message || 'Ошибка при добавлении зала');
    }
  };

  const deleteHall = async (hallId) => {
    const confirmDelete = window.confirm('Удалить этот зал? Сеансы будут удалены тоже!');
    if (!confirmDelete) return;

    try {
      await api.deleteHall(hallId);
      await fetchHalls();
    } catch (err) {
      console.error('Ошибка при удалении зала:', err);
      alert(err?.message || 'Ошибка при удалении зала');
    }
  };

  const handleUpdateHall = (hallId, priceStandart, priceVip) => {
    setHalls(prev =>
      prev.map(h =>
        h.id === hallId
          ? { ...h, hall_price_standart: priceStandart, hall_price_vip: priceVip }
          : h
      )
    );
  };

  return (
    <AdminLayout>
      <AdminHeader />
      <div className="admin-page-wrapper">
        {loading ? (
          <p>Загрузка залов...</p>
        ) : (
          <>
            <ManageHalls halls={halls} onAddHall={addHall} onDeleteHall={deleteHall} />
            <ConfigHalls halls={halls} />
            <ConfigPrices halls={halls} onUpdateHall={handleUpdateHall} />
            <Sessions halls={halls} />
            <OpenSale halls={halls} hallStates={hallStates} setHallStates={setHallStates} />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
