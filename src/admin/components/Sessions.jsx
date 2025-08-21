import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import poster3 from '../../assets/images/poster3.png';
import trash from '../../assets/icons/trash.png';
import Popup from './Popup';
import API from '../../api/api';
import '../styles/Sessions.css';

const DAY_MIN = 24 * 60;

const Sessions = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [movies, setMovies] = useState([]);
  const [sessions, setSessions] = useState({});
  const [draggedMovie, setDraggedMovie] = useState(null);
  const [draggedSession, setDraggedSession] = useState(null);
  const [popupData, setPopupData] = useState({ visible: false, movieId: null, hall: '', time: '' });
  const [addMoviePopupVisible, setAddMoviePopupVisible] = useState(false);
  const [newMovieData, setNewMovieData] = useState({
    title: '',
    duration: '',
    description: '',
    country: '',
    color: '#ffffff',
    posterFile: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const api = new API();

  // Цвет по id фильма (сохранение стиля проекта)
  const getColorByIndex = (id) => {
    const colors = ['#CAFF85', '#85FF89', '#85FFD3', '#85E2FF', '#8599FF'];
    return colors[(id - 1) % colors.length];
  };

  const toggleOpen = () => setIsOpen(!isOpen);

  // --- helpers ---

  const transformSeances = (seancesData) => {
    const sessionsByHall = {};
    if (seancesData) {
      seancesData.forEach(seance => {
        const hall = halls.find(h => h.id === seance.seance_hallid);
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
    }
    return sessionsByHall;
  };

  const loadAllData = async () => {
    const token = localStorage.getItem('token');
    if (token) api.setToken(token);

    const data = await api.getAllData();

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
    setSessions(transformSeances(data.seances));
  };

  const reloadSessions = async () => {
    try {
      const data = await api.getAllData();
      setSessions(transformSeances(data.seances));
    } catch (error) {
      console.error('Ошибка при загрузке сеансов:', error);
    }
  };

  // --- effects ---

  useEffect(() => {
    (async () => {
      try {
        await loadAllData();
      } catch (e) {
        console.error('Ошибка при загрузке данных:', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [halls]);

  // --- movies CRUD ---

  const removeMovie = async (id) => {
    try {
      setIsLoading(true);
      await api.deleteMovie(id);

      // локально удалить фильм
      setMovies(prev => prev.filter(movie => movie.id !== id));

      // удалить сеансы с этим фильмом
      setSessions(prev => {
        const updated = {};
        for (const hall in prev) {
          updated[hall] = prev[hall].filter(s => s.movieId !== id);
        }
        return updated;
      });
    } catch (error) {
      console.error('Ошибка при удалении фильма:', error);
      alert('Ошибка при удалении фильма: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddMoviePopup = () => {
    setNewMovieData({
      title: '',
      duration: '',
      description: '',
      country: '',
      color: '#ffffff',
      posterFile: null
    });
    setAddMoviePopupVisible(true);
  };

  const closeAddMoviePopup = () => {
    setAddMoviePopupVisible(false);
    setNewMovieData({
      title: '',
      duration: '',
      description: '',
      country: '',
      color: '#ffffff',
      posterFile: null
    });
  };

  const handleAddMovieChange = (field, value) => {
    setNewMovieData(prev => ({ ...prev, [field]: value }));
  };

  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Размер файла не должен превышать 3 MB');
        return;
      }
      if (file.type !== 'image/png') {
        alert('Файл должен быть в формате PNG');
        return;
      }
      setNewMovieData(prev => ({ ...prev, posterFile: file }));
    }
  };

  const handleAddMovieSubmit = async () => {
    const title = newMovieData.title.trim();
    const duration = Number(newMovieData.duration);

    if (!title) {
      alert('Введите название фильма');
      return;
    }
    if (!duration || duration <= 0) {
      alert('Введите корректную длительность в минутах');
      return;
    }

    try {
      setIsLoading(true);

      // ВАЖНО: ключи в camelCase, как требует сервер: filmName, filmDuration, filmDescription, filmOrigin, filePoster
      const formData = new FormData();
      formData.append('filmName', title);
      formData.append('filmDuration', String(duration));
      formData.append('filmDescription', newMovieData.description || '');
      formData.append('filmOrigin', newMovieData.country || '');
      if (newMovieData.posterFile) {
        formData.append('filePoster', newMovieData.posterFile);
      }

      await api.createMovie(formData);

      // После успешного добавления — перечитываем alldata и пересобираем состояние
      await loadAllData();

      closeAddMoviePopup();
      alert('Фильм успешно добавлен!');
    } catch (error) {
      console.error('Ошибка при добавлении фильма:', error);
      alert('Ошибка при добавлении фильма: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- drag & drop: adding session by dropping movie on timeline ---

  const onDragStart = (movie) => setDraggedMovie(movie);

  const onDrop = (hall) => {
    if (!draggedMovie) return;
    setPopupData({ visible: true, movieId: draggedMovie.id, hall, time: '' });
    setDraggedMovie(null);
  };

  // --- sessions CRUD / drag-delete ---

  const onSessionDragStart = (hall, idx) => (e) => {
    setDraggedSession({ hall, idx });
    e.dataTransfer.effectAllowed = 'move';
  };

  const onSessionDragEnd = () => setDraggedSession(null);

  const onTrashDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onTrashDrop = async (e) => {
    e.preventDefault();
    if (!draggedSession) return;
    const { hall, idx } = draggedSession;

    try {
      setIsLoading(true);
      const sessionToDelete = sessions[hall]?.[idx];

      if (!sessionToDelete) {
        throw new Error('Сеанс не найден');
      }

      const isConfirmed = window.confirm('Вы уверены, что хотите удалить этот сеанс?');
      if (!isConfirmed) {
        setDraggedSession(null);
        setIsLoading(false);
        return;
      }

      await api.deleteSession(sessionToDelete.id);

      setSessions(prev => {
        const copy = { ...prev };
        if (copy[hall]) {
          copy[hall] = copy[hall].filter((_, i) => i !== idx);
        }
        return copy;
      });

      alert('Сеанс успешно удален!');
    } catch (error) {
      console.error('Ошибка при удалении сеанса:', error);
      alert('Ошибка при удалении сеанса: ' + error.message);
    } finally {
      setDraggedSession(null);
      setIsLoading(false);
      // Небольшая задержка не обязательна; просто синхронизируемся с сервером
      reloadSessions();
    }
  };

  const onPopupSubmit = async () => {
    const { movieId, hall, time } = popupData;
    if (!time) {
      alert('Введите время!');
      return;
    }

    try {
      setIsLoading(true);
      const hallObj = halls.find(h => h.hall_name === hall);
      if (!hallObj) {
        alert('Зал не найден');
        return;
      }

      const result = await api.createSession({
        seanceHallid: hallObj.id,
        seanceFilmid: Number(movieId),
        seanceTime: time
      });

      // добавить локально
      setSessions(prev => {
        const hallSessions = [...(prev[hall] || [])];
        hallSessions.push({
          id: result?.id ?? `${hall}-${movieId}-${time}`, // на случай если сервер не вернул id
          movieId: Number(movieId),
          start: time
        });
        return { ...prev, [hall]: hallSessions };
      });

      setPopupData({ visible: false, movieId: null, hall: '', time: '' });
    } catch (error) {
      console.error('Ошибка при добавлении сеанса:', error);
      alert('Ошибка при добавлении сеанса: ' + error.message);
    } finally {
      setIsLoading(false);
      reloadSessions();
    }
  };

  const onPopupClose = () => setPopupData({ visible: false, movieId: null, hall: '', time: '' });

  // --- render ---

  return (
    <section className="sessions-wrapper">
      <AccordionHeader
        title="СЕТКА СЕАНСОВ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {isOpen && (
        <div className="sessions-content">
          <button className="add-movie-btn" onClick={openAddMoviePopup} disabled={isLoading}>
            {isLoading ? 'ЗАГРУЗКА...' : 'ДОБАВИТЬ ФИЛЬМ'}
          </button>

          <div className="movies-list">
            {movies.map(movie => (
              <div
                key={movie.id}
                className="movie-card"
                style={{ backgroundColor: movie.color }}
                draggable={!isLoading}
                onDragStart={() => !isLoading && onDragStart(movie)}
              >
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-duration">{movie.duration} минут</div>
                </div>
                <button
                  className="delete-movie-btn"
                  onClick={() => !isLoading && removeMovie(movie.id)}
                  disabled={isLoading}
                  aria-label="Удалить фильм"
                >
                  <img src={trash} alt="Удалить" className="trash-icon" />
                </button>
              </div>
            ))}
          </div>

          {halls.map(({ hall_name, id }) => {
            const shows = sessions[hall_name] || [];

            return (
              <div key={id} className="hall-schedule" style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div
                  className="schedule-trash"
                  onDragOver={onTrashDragOver}
                  onDrop={onTrashDrop}
                  title="Перетащите сюда сеанс для удаления"
                  style={{ visibility: draggedSession?.hall === hall_name ? 'visible' : 'hidden' }}
                >
                  <img src={trash} alt="Удалить сеанс" />
                </div>

                <div
                  className="timeline-wrapper"
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => !isLoading && onDrop(hall_name)}
                >
                  <div className="hall-name">{hall_name}</div>

                  <div className="timeline">
                    {shows.map(({ movieId, start, id: sessionId }, idx) => {
                      const movie = movies.find(m => m.id === movieId);
                      if (!movie) return null;

                      const [hours, minutes] = start.split(':').map(Number);
                      const startMin = hours * 60 + minutes;
                      let leftPct = (startMin / DAY_MIN) * 100;
                      let widthPct = (movie.duration / DAY_MIN) * 100;

                      if (leftPct + widthPct > 100) widthPct = 100 - leftPct;
                      if (leftPct > 100) return null;

                      return (
                        <React.Fragment key={`${sessionId}-${start}`}>
                          <div
                            className="session-block"
                            title={`${movie.title} — ${start}`}
                            style={{
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              backgroundColor: movie.color
                            }}
                            draggable={!isLoading}
                            onDragStart={!isLoading ? onSessionDragStart(hall_name, idx) : undefined}
                            onDragEnd={onSessionDragEnd}
                          >
                            {movie.title}
                          </div>
                          <div
                            key={`tick-${sessionId}-${start}`}
                            className="session-tick"
                            style={{ left: `${leftPct}%` }}
                          />
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="timeline-times">
                    {shows.map(({ start }, idx) => {
                      const [hours, minutes] = start.split(':').map(Number);
                      const leftPct = ((hours * 60 + minutes) / DAY_MIN) * 100;
                      if (leftPct > 100) return null;
                      return (
                        <div
                          key={`${hall_name}-time-${idx}-${start}`}
                          className="session-time"
                          style={{ left: `${leftPct}%` }}
                        >
                          {start}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="buttons-row">
            <button className="btn cancel-btn" disabled={isLoading}>
              ОТМЕНА
            </button>
            <button className="btn save-btn" disabled={isLoading}>
              {isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
            </button>
          </div>
        </div>
      )}

      <Popup
        visible={popupData.visible}
        title="ДОБАВЛЕНИЕ СЕАНСА"
        fields={[
          {
            type: 'select',
            label: 'Название зала',
            name: 'hall',
            value: popupData.hall,
            options: halls.map(h => ({ value: h.hall_name, label: h.hall_name })),
            onChange: e => setPopupData(prev => ({ ...prev, hall: e.target.value })),
          },
          {
            type: 'select',
            label: 'Название фильма',
            name: 'movieId',
            value: popupData.movieId || '',
            options: movies.map(m => ({ value: m.id, label: m.title })),
            onChange: e => setPopupData(prev => ({ ...prev, movieId: e.target.value })),
          },
          {
            type: 'time',
            label: 'Время начала',
            name: 'time',
            value: popupData.time,
            onChange: e => setPopupData(prev => ({ ...prev, time: e.target.value })),
          },
        ]}
        buttons={[
          {
            text: 'Добавить сеанс',
            onClick: onPopupSubmit,
            className: 'btn-add',
            disabled: isLoading
          },
          {
            text: 'Отменить',
            onClick: onPopupClose,
            className: 'btn-cancel',
            disabled: isLoading
          },
        ]}
        onClose={onPopupClose}
      />

      <Popup
        visible={addMoviePopupVisible}
        title="ДОБАВЛЕНИЕ ФИЛЬМА"
        fields={[
          {
            type: 'text',
            label: 'Название фильма',
            name: 'title',
            value: newMovieData.title,
            placeholder: 'Например, «Гражданин Кейн»',
            onChange: e => handleAddMovieChange('title', e.target.value),
            disabled: isLoading
          },
          {
            type: 'number',
            label: 'Продолжительность фильма (мин.)',
            name: 'duration',
            value: newMovieData.duration,
            onChange: e => handleAddMovieChange('duration', e.target.value),
            disabled: isLoading
          },
          {
            type: 'textarea',
            label: 'Описание фильма',
            name: 'description',
            value: newMovieData.description,
            onChange: e => handleAddMovieChange('description', e.target.value),
            disabled: isLoading
          },
          {
            type: 'text',
            label: 'Страна',
            name: 'country',
            value: newMovieData.country,
            onChange: e => handleAddMovieChange('country', e.target.value),
            disabled: isLoading
          },
          {
            type: 'color',
            label: 'Цвет для отображения',
            name: 'color',
            value: newMovieData.color,
            onChange: e => handleAddMovieChange('color', e.target.value),
            disabled: isLoading
          },
          {
            type: 'file',
            label: 'Постер фильма (PNG, макс. 3MB)',
            name: 'poster',
            accept: 'image/png',
            onChange: handlePosterUpload,
            disabled: isLoading
          },
        ]}
        buttons={[
          {
            text: 'Добавить фильм',
            onClick: handleAddMovieSubmit,
            className: 'btn-add',
            disabled: isLoading
          },
          {
            text: 'Отменить',
            onClick: closeAddMoviePopup,
            className: 'btn-cancel',
            disabled: isLoading
          },
        ]}
        onClose={closeAddMoviePopup}
      />
    </section>
  );
};

export default Sessions;
