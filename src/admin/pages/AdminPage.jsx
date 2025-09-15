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
import poster3 from '../../assets/images/poster3.png';

const api = new API();

const getColorByIndex = (id) => {
  const colors = ['#CAFF85', '#85FF89', '#85FFD3', '#85E2FF', '#8599FF'];
  return colors[(id - 1) % colors.length];
};

const AdminPage = () => {
  const [halls, setHalls] = useState([]);
  const [hallStates, setHallStates] = useState({});
  const [loading, setLoading] = useState(true);

  // добавлено: единые источники фильмов и сеансов //
  const [movies, setMovies] = useState([]);
  const [sessions, setSessions] = useState({});

  // ЕДИНЫЙ запрос ко всем данным //
  const fetchAllData = useCallback(async () => {
    try {
      const data = await api.getAllData();

      // Halls //
      const hallsList = Array.isArray(data.halls) ? data.halls : Array.isArray(data) ? data : [];
      const filtered = hallsList.filter(h => h.hall_name && !h.hall_name.startsWith('temp-'));
      setHalls(filtered);

      // Hall states из localStorage //
      const stored = localStorage.getItem('hallStates');
      const savedStates = stored ? JSON.parse(stored) : {};
      const newStates = {};
      filtered.forEach(h => {
        newStates[h.hall_name] = savedStates[h.hall_name] || false;
      });
      setHallStates(newStates);

      // Movies //
      const formattedMovies = (data.films || []).map(film => ({
        id: film.id,
        title: film.film_name,
        duration: film.film_duration,
        description: film.film_description || '',
        country: film.film_origin || '',
        color: getColorByIndex(film.id),
        image: film.film_poster || poster3
      }));
      setMovies(formattedMovies);

      // Sessions сгруппированные по hall_name //
      const sessionsByHall = {};
      (data.seances || []).forEach(seance => {
        const hall = filtered.find(h => h.id === seance.seance_hallid);
        if (hall) {
          const hallName = hall.hall_name;
          if (!sessionsByHall[hallName]) sessionsByHall[hallName] = [];
          sessionsByHall[hallName].push({
            id: seance.id,
            movieId: seance.seance_filmid,
            start: seance.seance_time
          });
        }
      });
      setSessions(sessionsByHall);
    } catch (err) {
      console.error('Ошибка загрузки залов:', err);
      alert('Ошибка при загрузке залов: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(); //  ЕДИНСТВЕННЫЙ ВЫЗОВ /alldata при первом рендере //
  }, [fetchAllData]);

  const addHall = async (hallName) => {
    try {
      await api.createHall({ hallName });
      await fetchAllData();
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
      await fetchAllData();
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
            {/* ПЕРЕБРАСЫВАЕМ готовые данные в Sessions */}
            <Sessions
  halls={halls}
  moviesData={movies}
  sessionsData={sessions}
  onRefreshAllData={fetchAllData}
/>
            <OpenSale halls={halls} hallStates={hallStates} setHallStates={setHallStates} />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;
