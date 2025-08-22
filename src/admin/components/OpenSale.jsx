import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import API from '../../api/api'; // путь к вашему api.js
import '../styles/OpenSale.css';

const OpenSale = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Установить первый зал при загрузке/изменении
  useEffect(() => {
    if (halls.length > 0) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls]);

  const handleToggleSale = async () => {
    try {
      setIsLoading(true);
      const api = new API();
      const token = localStorage.getItem('token');
      if (token) api.setToken(token);

      const hall = halls.find(h => h.hall_name === selectedHall);
      if (!hall) throw new Error('Зал не найден');

      // Открытие продаж
      const updatedHall = await api.toggleHallOpen(hall.id, 1);

      alert(`Зал «${hall.hall_name}» теперь ОТКРЫТ для продаж`);
    } catch (e) {
      console.error('Ошибка при изменении статуса:', e);
      alert('Не удалось изменить статус продаж: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="open-sale">
      <AccordionHeader
        title="ОТКРЫТЬ ПРОДАЖИ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {isOpen && (
        <div className="open-sale-content">
          <div className="open-sale-select">
            <span className="open-sale-select-label">
              Выберите зал для открытия продаж:
            </span>
            <div className="open-sale-select-buttons">
              {halls.map(hall => (
                <button
                  key={hall.id}
                  className={`open-sale-select-btn ${selectedHall === hall.hall_name ? 'active' : ''}`}
                  onClick={() => setSelectedHall(hall.hall_name)}
                >
                  {hall.hall_name}
                </button>
              ))}
            </div>
          </div>

          <div className="button-container">
            <button
              className="open-sale-final-button"
              onClick={handleToggleSale}
              disabled={isLoading || !selectedHall}
            >
              {isLoading ? 'ОБРАБОТКА...' : 'ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OpenSale;
