import React, { useState, useEffect } from 'react';
import AccordionHeader from './AccordionHeader';
import '../styles/OpenSale.css';

const OpenSale = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].hall_name : '');

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (!halls.find(h => h.hall_name === selectedHall) && halls.length > 0) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls, selectedHall]);

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
            <span className="open-sale-select-label">Выберите зал для открытия/закрытия продаж:</span>
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
            <button className="open-sale-final-button">ОТКРЫТЬ ПРОДАЖУ БИЛЕТОВ</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OpenSale;
