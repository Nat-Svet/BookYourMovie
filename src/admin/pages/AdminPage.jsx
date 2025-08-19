import React, { useEffect, useState } from 'react';
import ManageHalls from '../components/ManageHalls';
import ConfigHalls from '../components/ConfigHalls';
import ConfigPrices from '../components/ConfigPrices';
import Sessions from '../components/Sessions';
import OpenSale from '../components/OpenSale';
import AdminLayout from '../components/AdminLayout';
import AdminHeader from '../components/AdminHeader';
import '../styles/AdminPage.css';

const AdminPage = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, []);




  const fetchHalls = async () => {
  try {
    const formData = new FormData();
    formData.set('hallName', `temp-${Date.now()}`);

    const res = await fetch('https://shfe-diplom.neto-server.ru/hall', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log('📥 fetchHalls → ответ:', data);

    const hallsList =
      data.halls ??
      (data.result && Array.isArray(data.result.halls)
        ? data.result.halls
        : []);

    const filtered = hallsList.filter(h => h.hall_name && !h.hall_name.startsWith('temp-'));
    setHalls(filtered);
  } catch (err) {
    console.error('❌ Ошибка загрузки залов:', err);
  } finally {
    setLoading(false);
  }
};





  const addHall = async (hallName) => {
    try {
      console.log('📤 addHall вызван с:', hallName);
      const formData = new FormData();
      formData.set('hallName', hallName);

      const res = await fetch('https://shfe-diplom.neto-server.ru/hall', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('✅ Ответ от API (add):', data);

      if (data.success) {
        await fetchHalls();
      } else {
        alert(data.error || 'Ошибка при добавлении зала');
      }
    } catch (err) {
      console.error('❌ Ошибка при добавлении зала:', err);
      alert('Ошибка при добавлении зала');
    }
  };

  const deleteHall = async (hallId) => {
    const confirmDelete = window.confirm('Удалить этот зал? Сеансы будут удалены тоже!');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('🗑 Ответ от API (delete):', data);

      if (data.success) {
        await fetchHalls();
      } else {
        alert(data.error || 'Ошибка при удалении зала');
      }
    } catch (err) {
      console.error('❌ Ошибка при удалении зала:', err);
      alert('Ошибка при удалении зала');
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
            <ManageHalls halls={halls} addHall={addHall} deleteHall={deleteHall} />
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
