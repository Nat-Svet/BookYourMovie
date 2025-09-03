import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import API from '../../api/api';
import '../styles/OpenSale.css';

const OpenSale = ({ halls }) => {
  // Состояние: открыт ли аккордеон //
  const [isOpen, setIsOpen] = useState(true);
  // Текущий выбранный зал //
  const [selectedHall, setSelectedHall] = useState('');
  // Флаг загрузки, чтобы заблокировать кнопку во время запроса //
  const [isLoading, setIsLoading] = useState(false);
  // Объект с состояниями продаж по каждому залу: { "Зал 1": true, "Зал 2": false } //
  const [hallStates, setHallStates] = useState({});
  // Функция для открытия/закрытия аккордеона //  
  const toggleOpen = () => setIsOpen(!isOpen);

  // Когда список залов загружен или изменился — выбираем первый зал по умолчанию //
  useEffect(() => {
    if (halls.length > 0) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls]);

  // Получение текущего состояния продаж для зала //
  const getHallSaleState = (hallName) => {
    return hallStates[hallName] || false;
  };

  // Основная функция для переключения состояния продаж (открыть/закрыть) //
  const handleToggleSale = async () => {
    try {
      setIsLoading(true); // Включаем индикатор загрузки //
      const api = new API(); // создаём новый экземпляр API //
      const token = localStorage.getItem('token'); // получаем токен из хранилища //
      if (token) api.setToken(token); // устанавливаем токен в API //

      // Находим объект зала по имени //
      const hall = halls.find(h => h.hall_name === selectedHall);
      if (!hall) throw new Error('Зал не найден');

      // Получаем текущее состояние зала (открыт/закрыт) //
      const currentState = getHallSaleState(selectedHall);
      const newState = !currentState;

      // Отправляем новое состояние на сервер (1 — открыт, 0 — закрыт) //
      const updatedHall = await api.toggleHallOpen(hall.id, newState ? 1 : 0);

      // Обновляем состояние конкретного зала в объекте hallStates //
      setHallStates(prev => ({
        ...prev,
        [selectedHall]: newState
      }));

      // Показываем уведомление пользователю //
      alert(newState
        ? `Зал «${hall.hall_name}» теперь ОТКРЫТ для продаж`
        : `Зал «${hall.hall_name}» теперь ЗАКРЫТ для продаж`);
    } catch (e) {
      // Если произошла ошибка — выводим сообщение в консоль и алерт //
      console.error('Ошибка при изменении статуса:', e);
      alert('Не удалось изменить статус продаж: ' + e.message);
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки //
    }
  };

  return (
    <section className="open-sale">
      {/* Заголовок аккордеона */}
      <AccordionHeader
        title="ОТКРЫТЬ ПРОДАЖИ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      {/* вертикальная линия */}
      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {/* Содержимое — только если аккордеон открыт */}
      {isOpen && (
        <div className="open-sale-content">
          {/* Выбор зала */}
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

          {/* Декларация, что всё готово к запуску */}
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
              {/* Меняем текст на кнопке в зависимости от состояния */}
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