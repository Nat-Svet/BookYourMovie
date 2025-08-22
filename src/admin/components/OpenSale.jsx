import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import API from '../../api/api';
import '../styles/OpenSale.css';

const OpenSale = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hallStates, setHallStates] = useState({}); // Состояние продаж для каждого зала

  const toggleOpen = () => setIsOpen(!isOpen);

  // Установить первый зал при загрузке/изменении
  useEffect(() => {
    if (halls.length > 0) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls]);

  // Функция для получения текущего состояния продаж зала
  const getHallSaleState = (hallName) => {
    return hallStates[hallName] || false;
  };

  const handleToggleSale = async () => {
    try {
      setIsLoading(true);
      const api = new API();
      const token = localStorage.getItem('token');
      if (token) api.setToken(token);

      const hall = halls.find(h => h.hall_name === selectedHall);
      if (!hall) throw new Error('Зал не найден');

      const currentState = getHallSaleState(selectedHall);
      const newState = !currentState;

      // Обновление состояния продаж
      const updatedHall = await api.toggleHallOpen(hall.id, newState ? 1 : 0);

      // Обновляем состояние для этого зала
      setHallStates(prev => ({
        ...prev,
        [selectedHall]: newState
      }));

      alert(newState
        ? `Зал «${hall.hall_name}» теперь ОТКРЫТ для продаж`
        : `Зал «${hall.hall_name}» теперь ЗАКРЫТ для продаж`);
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
              Выберите зал для открытия/закрытия продаж:
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


          <div className="finalDeclaration">
            <span className="finalDeclaration_text">
              Все готово к открытию
            </span>
          </div>



          <div className="button-container">
            <button
              className="open-sale-final-button"
              onClick={handleToggleSale}
              disabled={isLoading || !selectedHall}
            >
              {isLoading
                ? 'ОБРАБОТКА...'
                : getHallSaleState(selectedHall)
                  ? 'ЗАКРЫТЬ ПРОДАЖУ БИЛЕТОВ'
                  : 'ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OpenSale;