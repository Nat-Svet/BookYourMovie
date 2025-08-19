// [исправленный компонент Sessions]

import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import poster3 from '../../assets/images/poster3.png';
import trash from '../../assets/icons/trash.png';
import Popup from './Popup';

import '../styles/Sessions.css';

const initialMovies = [
  { id: 1, title: 'Звёздные войны XXIII: Атака клонированных клонов', duration: 130, color: '#CAFF85', image: poster3 },
  { id: 2, title: 'Миссия выполнима', duration: 120, color: '#85FF89', image: poster3 },
  { id: 3, title: 'Серая пантера', duration: 90,  color: '#85FFD3', image: poster3 },
  { id: 4, title: 'Движение вбок', duration: 95,  color: '#85E2FF', image: poster3 },
  { id: 5, title: 'Кот Да Винчи',  duration: 100, color: '#8599FF', image: poster3 },
];

const DAY_MIN = 24 * 60;

const Sessions = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [movies, setMovies] = useState(initialMovies);
  const [sessions, setSessions] = useState({});
  const [draggedMovie, setDraggedMovie] = useState(null);
  const [draggedSession, setDraggedSession] = useState(null);

  const [popupData, setPopupData] = useState({ visible: false, movieId: null, hall: '', time: '' });
  const [addMoviePopupVisible, setAddMoviePopupVisible] = useState(false);
  const [newMovieData, setNewMovieData] = useState({ title: '', duration: '', description: '', country: '', color: '#ffffff' });

  useEffect(() => {
    setSessions(prev => {
      const next = {};
      halls.forEach(({ hall_name }) => { next[hall_name] = prev[hall_name] || []; });
      return next;
    });
  }, [halls]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const removeMovie = (id) => {
    setMovies(movies.filter(m => m.id !== id));
    setSessions(prev => {
      const next = {};
      for (const hall in prev) next[hall] = prev[hall].filter(s => s.movieId !== id);
      return next;
    });
  };

  const onDragStart = (movie) => setDraggedMovie(movie);
  const onDrop = (hall) => {
    if (!draggedMovie) return;
    setPopupData({ visible: true, movieId: draggedMovie.id, hall, time: '' });
    setDraggedMovie(null);
  };

  const onSessionDragStart = (hall, idx) => (e) => {
    setDraggedSession({ hall, idx });
    e.dataTransfer.effectAllowed = 'move';
  };
  const onSessionDragEnd = () => setDraggedSession(null);
  const onTrashDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const onTrashDrop = (e) => {
    e.preventDefault();
    if (!draggedSession) return;
    const { hall, idx } = draggedSession;
    setSessions(prev => {
      const copy = { ...prev };
      if (copy[hall]) copy[hall] = copy[hall].filter((_, i) => i !== idx);
      return copy;
    });
    setDraggedSession(null);
  };

  const onPopupSubmit = () => {
    const { movieId, hall, time } = popupData;
    if (!time) { alert('Введите время!'); return; }
    setSessions(prev => {
      const hallSessions = [...(prev[hall] || [])];
      hallSessions.push({ movieId: Number(movieId), start: time });
      return { ...prev, [hall]: hallSessions };
    });
    setPopupData({ visible: false, movieId: null, hall: '', time: '' });
  };
  const onPopupClose = () => setPopupData({ visible: false, movieId: null, hall: '', time: '' });

  const openAddMoviePopup = () => {
    setNewMovieData({ title: '', duration: '', description: '', country: '', color: '#ffffff' });
    setAddMoviePopupVisible(true);
  };
  const closeAddMoviePopup = () => {
    setAddMoviePopupVisible(false);
    setNewMovieData({ title: '', duration: '', description: '', country: '', color: '#ffffff' });
  };
  const handleAddMovieChange = (field, value) => setNewMovieData(prev => ({ ...prev, [field]: value }));
  const handleAddMovieSubmit = () => {
    const title = newMovieData.title.trim();
    const duration = Number(newMovieData.duration);
    if (!title) { alert('Введите название фильма'); return; }
    if (!duration || duration <= 0) { alert('Введите корректную длительность в минутах'); return; }
    const newId = movies.length ? Math.max(...movies.map(m => m.id)) + 1 : 1;
    setMovies(prev => ([
      ...prev,
      { id: newId, title, duration, description: newMovieData.description, country: newMovieData.country, color: newMovieData.color || '#ffffff', image: poster3 },
    ]));
    closeAddMoviePopup();
  };

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
          <button className="add-movie-btn" onClick={openAddMoviePopup}>ДОБАВИТЬ ФИЛЬМ</button>

          <div className="movies-list">
            {movies.map(movie => (
              <div
                key={movie.id}
                className="movie-card"
                style={{ backgroundColor: movie.color }}
                draggable
                onDragStart={() => onDragStart(movie)}
              >
                <img src={movie.image} alt={movie.title} className="movie-poster" />
                <div className="movie-info">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-duration">{movie.duration} минут</div>
                </div>
                <button
                  className="delete-movie-btn"
                  onClick={() => removeMovie(movie.id)}
                  aria-label="Удалить фильм"
                >
                  <img src={trash} alt="Удалить" className="trash-icon" />
                </button>
              </div>
            ))}
          </div>

          {halls.map(({ hall_name }) => {
            const shows = sessions[hall_name] || [];

            return (
              <div key={hall_name} className="hall-schedule" style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                <div className="schedule-trash" onDragOver={onTrashDragOver} onDrop={onTrashDrop} title="Перетащите сюда сеанс для удаления" style={{ visibility: draggedSession?.hall === hall_name ? 'visible' : 'hidden' }}>
                  <img src={trash} alt="Удалить сеанс" />
                </div>

                <div className="timeline-wrapper" onDragOver={e => e.preventDefault()} onDrop={() => onDrop(hall_name)}>
                  <div className="hall-name">{hall_name}</div>

                  <div className="timeline">
                    {shows.map(({ movieId, start }, idx) => {
                      const movie = movies.find(m => m.id === movieId);
                      if (!movie) return null;

                      const [hours, minutes] = start.split(':').map(Number);
                      const startMin = hours * 60 + minutes;
                      let leftPct = (startMin / DAY_MIN) * 100;
                      let widthPct = (movie.duration / DAY_MIN) * 100;
                      if (leftPct + widthPct > 100) widthPct = 100 - leftPct;
                      if (leftPct > 100) return null;

                      return (
                        <React.Fragment key={`${hall_name}-${idx}`}>
                          <div
                            className="session-block"
                            title={`${movie.title} — ${start}`}
                            style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: movie.color }}
                            draggable
                            onDragStart={onSessionDragStart(hall_name, idx)}
                            onDragEnd={onSessionDragEnd}
                          >
                            {movie.title}
                          </div>
                          <div className="session-tick" style={{ left: `${leftPct}%` }} />
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
                        <div key={`${hall_name}-t-${idx}`} className="session-time" style={{ left: `${leftPct}%` }}>{start}</div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="buttons-row">
            <button className="btn cancel-btn">ОТМЕНА</button>
            <button className="btn save-btn">СОХРАНИТЬ</button>
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
          { text: 'Добавить сеанс', onClick: onPopupSubmit, className: 'btn-add' },
          { text: 'Отменить', onClick: onPopupClose, className: 'btn-cancel' },
        ]}
        onClose={onPopupClose}
      />

      <Popup
        visible={addMoviePopupVisible}
        title="ДОБАВЛЕНИЕ ФИЛЬМА"
        fields={[
          { type: 'text', label: 'Название фильма', name: 'title', value: newMovieData.title, placeholder: 'Например, «Гражданин Кейн»', onChange: e => handleAddMovieChange('title', e.target.value) },
          { type: 'text', label: 'Продолжительность фильма (мин.)', name: 'duration', value: newMovieData.duration, onChange: e => handleAddMovieChange('duration', e.target.value) },
          { type: 'textarea', label: 'Описание фильма', name: 'description', value: newMovieData.description, onChange: e => handleAddMovieChange('description', e.target.value) },
          { type: 'text', label: 'Страна', name: 'country', value: newMovieData.country, onChange: e => handleAddMovieChange('country', e.target.value) },
          { type: 'color', label: 'Цвет для отображения', name: 'color', value: newMovieData.color, onChange: e => handleAddMovieChange('color', e.target.value) },
        ]}
        buttons={[
          { text: 'Добавить фильм', onClick: handleAddMovieSubmit, className: 'btn-add' },
          { text: 'Загрузить постер', onClick: () => alert('Функция загрузки постера пока не реализована'), className: 'btn-upload' },
          { text: 'Отменить', onClick: closeAddMoviePopup, className: 'btn-cancel' },
        ]}
        onClose={closeAddMoviePopup}
      />
    </section>
  );
};

export default Sessions;
