import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientHeader from '../components/ClientHeader';
import MovieCard from '../components/MovieCard';
import Button from '../components/Button';
import Layout from '../components/Layout';
import DatesNav from '../components/DatesNav';
import '../styles/MovieList.css';
import API from '../../api/api';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const api = new API();
        const data = await api.getAllData();
        
        const transformedMovies = transformApiData(data);
        setMovies(transformedMovies);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка при загрузке данных:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformApiData = (apiData) => {
    if (!apiData || !apiData.films || !apiData.halls || !apiData.seances) {
      return [];
    }
    
    const { films, halls, seances } = apiData;
    
    return films.map(film => {
      const filmSeances = seances.filter(seance => seance.seance_filmid === film.id);
      
      const hallsWithSeances = halls
        .filter(hall => filmSeances.some(seance => seance.seance_hallid === hall.id))
        .map(hall => {
          const seancesForHall = filmSeances
            .filter(seance => seance.seance_hallid === hall.id)
            .map(seance => ({
              time: seance.seance_time,
              id: seance.id
            }));
          
          return {
            name: hall.hall_name,
            seances: seancesForHall
          };
        });
      
      return {
        id: film.id,
        title: film.film_name,
        description: film.film_origin ? `${film.film_duration} минут, ${film.film_origin}` : `${film.film_duration} минут`,
        durationCountry: film.film_origin ? `${film.film_duration} минут ${film.film_origin}` : `${film.film_duration} минут`,
        imageSrc: film.film_poster,
        halls: hallsWithSeances
      };
    });
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleTimeClick = (seanceId, time, date) => {
    // Переходим на страницу выбора мест
    navigate(`/booking/${seanceId}`, { 
      state: { 
        seanceId, 
        date, 
        time 
      } 
    });
  };

  const handleLoginClick = () => {
  navigate('/admin/login'); // ✅ это ведёт на страницу Login
};


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

  return (
    <Layout>
      <div className="movie-list-container">
        <div className="movie-list-header">
          <ClientHeader />
          <Button onClick={handleLoginClick}>Войти</Button>
        </div>

        <DatesNav onDateChange={handleDateChange} selectedDate={selectedDate} />

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