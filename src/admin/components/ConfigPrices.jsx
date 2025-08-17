import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import '../styles/ConfigPrices.css';

const ConfigPrices = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].name : '');
  const [normalPrice, setNormalPrice] = useState(0);
  const [vipPrice, setVipPrice] = useState(350);

  const toggleOpen = () => setIsOpen(!isOpen);

  // При изменении списка залов сбрасываем selectedHall, если текущий отсутствует
  useEffect(() => {
    if (!halls.find(h => h.name === selectedHall) && halls.length > 0) {
      setSelectedHall(halls[0].name);
    }
  }, [halls, selectedHall]);

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
                  className={`config-prices-select-btn ${selectedHall === hall.name ? 'active' : ''}`}
                  onClick={() => setSelectedHall(hall.name)}
                >
                  {hall.name}
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
                  onChange={e => setNormalPrice(e.target.value)}
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
                  onChange={e => setVipPrice(e.target.value)}
                />
                <div className="config-prices-input-desc">
                  за <span className="seat-box seat-vip" /> VIP кресла
                </div>
              </div>
            </div>
          </div>

          <div className="config-prices-buttons">
            <button className="btn btn-cancel">ОТМЕНА</button>
            <button className="btn btn-save">СОХРАНИТЬ</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConfigPrices;
