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
  const [halls, setHalls] = useState([]); // Список залов //
  const [loading, setLoading] = useState(true); // Состояние загрузки //

  // Функция для загрузки залов с сервера //
  const fetchHalls = useCallback(async () => {
    try {
      const data = await api.getAllData(); // получаем все данные (фильмы, сеансы, залы и т.д.) //
      // Берём список залов из ответа //
      const hallsList = Array.isArray(data.halls) ? data.halls : Array.isArray(data) ? data : [];
      // Отфильтровываем лишние (например, временные залы с именем temp-) // 
      const filtered = hallsList.filter(h => h.hall_name && !h.hall_name.startsWith('temp-'));
      setHalls(filtered); // сохраняем в состояние //
    } catch (err) {
      console.error('❌ Ошибка загрузки залов:', err);
      alert('Ошибка при загрузке залов: ' + (err?.message || err));
    } finally {
      setLoading(false); // выключаем индикатор загрузки //
    }
  }, []);

  // Загружаем залы при первой загрузке страницы //
  useEffect(() => {
    fetchHalls();
  }, [fetchHalls]);

  // Добавление нового зала //
  const addHall = async (hallName) => {
    try {
      await api.createHall({ hallName }); // создаём зал на сервере //
      await fetchHalls(); // обновляем список залов //
    } catch (err) {
      console.error('❌ Ошибка при добавлении зала:', err);
      alert(err?.message || 'Ошибка при добавлении зала');
    }
  };

  // Удаление зала //
  const deleteHall = async (hallId) => {
    const confirmDelete = window.confirm('Удалить этот зал? Сеансы будут удалены тоже!');
    if (!confirmDelete) return; // если пользователь передумал — выходим //

    try {
      await api.deleteHall(hallId); // удаляем на сервере //
      await fetchHalls(); // обновляем список залов //
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
          // Если залы ещё загружаются — показываем текст //
          <p>Загрузка залов...</p>
        ) : (
          // Когда залы загружены — показываем все блоки админки //
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
