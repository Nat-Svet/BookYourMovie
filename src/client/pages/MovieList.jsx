import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем хук для навигации между страницами //
import ClientHeader from '../components/ClientHeader';
import MovieCard from '../components/MovieCard';
import Button from '../components/Button';
import Layout from '../components/Layout';
import DatesNav from '../components/DatesNav';
import '../styles/MovieList.css';
import API from '../../api/api';

// Основной компонент MovieList //
const MovieList = () => {
  // Состояния: фильмы, загрузка, ошибка, выбранная дата //
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0] // по умолчанию — сегодняшняя дата //
  );
  const navigate = useNavigate(); // хук для перехода по страницам //

  // Загружаем данные при первом рендере //
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // включаем индикатор загрузки //
        const api = new API(); // создаём объект API //
        const data = await api.getAllData(); // получаем все данные с сервера //

        // Преобразуем данные API в удобный формат //
        const transformedMovies = transformApiData(data);
        setMovies(transformedMovies);
      } catch (err) {
        setError(err.message); // сохраняем текст ошибки //
        console.error('Ошибка при загрузке данных:', err);
      } finally {
        setLoading(false); // отключаем индикатор загрузки //
      }
    };

    fetchData();
  }, []);

  // Проверка, открыт ли зал (разные варианты данных от API) //
  const isHallOpen = (hall) => {
    const raw = hall?.hall_open ?? hall?.is_open ?? hall?.open;
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'number') return raw === 1;
    if (typeof raw === 'string') return raw === '1' || raw.toLowerCase() === 'true';
    return false;
  };

  // Функция преобразования данных от API в структуру для MovieCard //
  const transformApiData = (apiData) => {
    if (!apiData || !apiData.films || !apiData.halls || !apiData.seances) {
      return [];
    }

    const { films, halls, seances } = apiData;
    const hallsById = new Map(halls.map(h => [h.id, h])); // для быстрого поиска зала по id //

    // Берём только сеансы в открытых залах //
    const openSeances = seances.filter(seance => {
      const hall = hallsById.get(seance.seance_hallid);
      return hall && isHallOpen(hall);
    });

    // Собираем данные по каждому фильму //
    return films
      .map(film => {
        // Все сеансы этого фильма //
        const filmSeances = openSeances.filter(s => s.seance_filmid === film.id);

        // Группируем сеансы по залам //
        const hallsWithSeances = filmSeances.reduce((acc, seance) => {
          const hall = hallsById.get(seance.seance_hallid);
          if (!hall) return acc;

          const hallName = hall.hall_name;
          if (!acc[hallName]) acc[hallName] = [];

          acc[hallName].push({
            time: seance.seance_time,
            id: seance.id,
            hallId: hall.id,
          });

          return acc;
        }, {});

        // Преобразуем объект залов в массив //
        const hallsArray = Object.entries(hallsWithSeances).map(([name, seances]) => {
          const hall = halls.find(h => h.hall_name === name);
          return {
            id: hall?.id,
            name,
            // Сортируем сеансы по времени //
            seances: seances.sort((a, b) => {
              const [h1, m1] = a.time.split(':').map(Number);
              const [h2, m2] = b.time.split(':').map(Number);
              return h1 * 60 + m1 - (h2 * 60 + m2);
            }),
          };
        });

        // Возвращаем данные о фильме в нужном виде //
        return {
          id: film.id,
          title: film.film_name,
          description: film.film_description || '',
          durationCountry: film.film_origin
            ? `${film.film_duration} минут · ${film.film_origin}`
            : `${film.film_duration} минут`,
          imageSrc: film.film_poster || '/default-poster.png',
          halls: hallsArray,
        };
      })
      // Убираем фильмы, у которых нет доступных залов/сеансов //
      .filter(movie => movie.halls.length > 0);
  };

  // Смена даты через компонент DatesNav //
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Переход на страницу бронирования при выборе сеанса //
  const handleTimeClick = (seanceId, time, date) => {
    navigate(`/booking/${seanceId}`, {
      state: {
        seanceId,
        date,
        time,
      },
    });
  };

  // Клик по кнопке "Войти" → переход в админ-панель //
  const handleLoginClick = () => {
    navigate('/admin/login');
  };

  // Если данные ещё загружаются //
  if (loading) {
    return (
      <Layout>
        <div className="movie-list-container">
          <div className="movie-list-header">
            <ClientHeader />
            <Button onClick={handleLoginClick}>Войти</Button>
          </div>
          <div className="loading">Загрузка...</div>
        </div>
      </Layout>
    );
  }

  // Если произошла ошибка при загрузке //
  if (error) {
    return (
      <Layout>
        <div className="movie-list-container">
          <div className="movie-list-header">
            <ClientHeader />
            <Button onClick={handleLoginClick}>Войти</Button>
          </div>
          <div className="error">Ошибка: {error}</div>
        </div>
      </Layout>
    );
  }

  // Основной контент — список фильмов //
  return (
    <Layout>
      <div className="movie-list-container">

        {/* Шапка: логотип и кнопка входа */}
        <div className="movie-list-header">
          <ClientHeader />
          <Button onClick={handleLoginClick}>Войти</Button>
        </div>

        {/* Навигация по датам */}
        <DatesNav onDateChange={handleDateChange} selectedDate={selectedDate} />

        {/* Список фильмов */}
        <div className="movie-list-movies">
          {movies.length > 0 ? (
            movies.map(movie => (
              <MovieCard
                key={movie.id}
                title={movie.title}
                description={movie.description}
                durationCountry={movie.durationCountry}
                imageSrc={movie.imageSrc}
                halls={movie.halls}
                onTimeClick={handleTimeClick}
                selectedDate={selectedDate}
              />
            ))
          ) : (
            <div className="no-movies">Нет доступных фильмов</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MovieList;
