import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import '../styles/ConfigPrices.css';
import API from '../../api/api';

const ConfigPrices = ({ halls }) => {
  // Состояние: открыт ли блок (аккордеон) //
  const [isOpen, setIsOpen] = useState(true);
  // Название текущего выбранного зала //
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].hall_name : '');
  // Цена за обычное кресло //
  const [normalPrice, setNormalPrice] = useState(0);
  // Цена за VIP кресло //
  const [vipPrice, setVipPrice] = useState(350);
  // Флаг загрузки — чтобы показывать, когда идёт сохранение //
  const [isLoading, setIsLoading] = useState(false);

  // Создаём экземпляр API //
  const api = new API();
  // При первом рендере получаем токен из localStorage и устанавливаем его в API //
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
    }
  }, []);

  // Функция для открытия/закрытия аккордеона //
  const toggleOpen = () => setIsOpen(!isOpen);

  // Эффект: если выбранного зала больше нет в списке — выбираем первый доступный //
  useEffect(() => {
    if (!halls.find(h => h.hall_name === selectedHall) && halls.length > 0) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls, selectedHall]);

  // Эффект: при смене выбранного зала — обновляем цены из его данных //
  useEffect(() => {
    if (selectedHall && halls.length > 0) {
      const hall = halls.find(h => h.hall_name === selectedHall);
      if (hall) {
        setNormalPrice(hall.hall_price_standart || 0); // если нет значения — ставим 0 //
        setVipPrice(hall.hall_price_vip || 350); // если нет значения — ставим 350
      }
    }
  }, [selectedHall, halls]);

  // Сохранение цен на сервер //
  const handleSave = async () => {
    // Находим зал по имени //
    const hall = halls.find(h => h.hall_name === selectedHall);
    if (!hall) {
      alert('Зал не найден');
      return;
    }

    setIsLoading(true); // включаем загрузку //

    try {
      // Отправляем цены через API с названиями параметров
      const result = await api.updatePrices(hall.id, {
        priceStandart: normalPrice,
        priceVip: vipPrice
      });

      console.log('Цены успешно обновлены:', result);
      alert('Цены успешно обновлены!');
    } catch (error) {
      console.error('Ошибка при обновлении цен:', error);
      alert('Ошибка при обновлении цен: ' + error.message);
    } finally {
      setIsLoading(false); // отключаем загрузку //
    }
  };

  // Отмена изменений — сброс к исходным значениям зала //
  const handleCancel = () => {
    const hall = halls.find(h => h.hall_name === selectedHall);
    if (hall) {
      setNormalPrice(hall.hall_price_standart || 0);
      setVipPrice(hall.hall_price_vip || 350);
    }
  };

  return (
    <section className="config-prices">
      {/* Заголовок аккордеона */}
      <AccordionHeader
        title="КОНФИГУРАЦИЯ ЦЕН"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      {/* вертикальная линия */}
      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {/* Отображаем содержимое, только если аккордеон открыт */}
      {isOpen && (
        <div className="config-prices-content">

          {/* Блок выбора зала */}
          <div className="config-prices-select">
            <span className="config-prices-select-label">Выберите зал для конфигурации:</span>
            <div className="config-prices-select-buttons">
              {halls.map(hall => (
                <button
                  key={hall.id}
                  className={`config-prices-select-btn ${selectedHall === hall.hall_name ? 'active' : ''}`}
                  onClick={() => setSelectedHall(hall.hall_name)}
                >
                  {hall.hall_name}
                </button>
              ))}
            </div>
          </div>

          {/* Инструкция */}
          <p className="config-prices-instruction">Установите цены для типов кресел:</p>

          {/* Поля ввода цен */}
          <div className="config-prices-inputs">
            {/* Обычные кресла */}
            <div className="config-prices-input-group">
              <label className="config-prices-input-label" htmlFor="normal-price">
                Цена, рублей
              </label>
              <div className="config-prices-input-row">
                <input
                  id="normal-price"
                  type="number"
                  min="0"
                  value={normalPrice}
                  onChange={e => setNormalPrice(Number(e.target.value))}
                  disabled={isLoading}
                />
                <div className="config-prices-input-desc">
                  за <span className="seat-box seat-normal" /> обычные кресла
                </div>
              </div>
            </div>

            {/* VIP кресла */}
            <div className="config-prices-input-group">
              <label className="config-prices-input-label" htmlFor="vip-price">
                Цена, рублей
              </label>
              <div className="config-prices-input-row">
                <input
                  id="vip-price"
                  type="number"
                  min="0"
                  value={vipPrice}
                  onChange={e => setVipPrice(Number(e.target.value))}
                  disabled={isLoading}
                />
                <div className="config-prices-input-desc">
                  за <span className="seat-box seat-vip" /> VIP кресла
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки "ОТМЕНА" и "СОХРАНИТЬ" */}
          <div className="config-prices-buttons">
            <button
              className="btn btn-cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              ОТМЕНА
            </button>
            <button
              className="btn btn-save"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConfigPrices;