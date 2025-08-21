import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import '../styles/ConfigPrices.css';
import API from '../../api/api';

const ConfigPrices = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].hall_name : '');
  const [normalPrice, setNormalPrice] = useState(0);
  const [vipPrice, setVipPrice] = useState(350);
  const [isLoading, setIsLoading] = useState(false);

  const api = new API();
  // Установка токена из localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
    }
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!halls.find(h => h.hall_name === selectedHall) && halls.length > 0) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls, selectedHall]);

  useEffect(() => {
    if (selectedHall && halls.length > 0) {
      const hall = halls.find(h => h.hall_name === selectedHall);
      if (hall) {
        setNormalPrice(hall.hall_price_standart || 0);
        setVipPrice(hall.hall_price_vip || 350);
      }
    }
  }, [selectedHall, halls]);

  const handleSave = async () => {
    const hall = halls.find(h => h.hall_name === selectedHall);
    if (!hall) {
      alert('Зал не найден');
      return;
    }

    setIsLoading(true);

    try {
      // Исправленные названия параметров согласно документации
      const result = await api.updatePrices(hall.id, {
        priceStandart: normalPrice,  // Исправлено на priceStandart
        priceVip: vipPrice           // Исправлено на priceVip
      });

      console.log('Цены успешно обновлены:', result);
      alert('Цены успешно обновлены!');
    } catch (error) {
      console.error('Ошибка при обновлении цен:', error);
      alert('Ошибка при обновлении цен: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    const hall = halls.find(h => h.hall_name === selectedHall);
    if (hall) {
      setNormalPrice(hall.hall_price_standart || 0);
      setVipPrice(hall.hall_price_vip || 350);
    }
  };

  return (
    <section className="config-prices">
      <AccordionHeader 
        title="КОНФИГУРАЦИЯ ЦЕН"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {isOpen && (
        <div className="config-prices-content">
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

          <p className="config-prices-instruction">Установите цены для типов кресел:</p>

          <div className="config-prices-inputs">
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