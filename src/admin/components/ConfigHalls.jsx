import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import AccordionHeader from './AccordionHeader';
import '../styles/ConfigHalls.css';

const ConfigHalls = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].hall_name : '');
  const [rows, setRows] = useState(10);
  const [seatsPerRow, setSeatsPerRow] = useState(8);
  const [seatTypes, setSeatTypes] = useState(
    Array(rows).fill(null).map(() => Array(seatsPerRow).fill(0))
  );

  const toggleOpen = () => setIsOpen(!isOpen);

  useEffect(() => {
    setSeatTypes(
      Array(rows).fill(null).map(() => Array(seatsPerRow).fill(0))
    );
  }, [rows, seatsPerRow]);

  const toggleSeatType = (rowIndex, seatIndex) => {
    setSeatTypes(prev => {
      const newSeatTypes = prev.map(r => [...r]);
      const currentType = newSeatTypes[rowIndex][seatIndex];
      newSeatTypes[rowIndex][seatIndex] = (currentType + 1) % 3;
      return newSeatTypes;
    });
  };

  const onRowsChange = e => {
    const value = Number(e.target.value);
    if (value > 0) setRows(value);
  };

  const onSeatsChange = e => {
    const value = Number(e.target.value);
    if (value > 0) setSeatsPerRow(value);
  };

  useEffect(() => {
    if (halls.length > 0 && !halls.find(h => h.hall_name === selectedHall)) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls, selectedHall]);

  return (
    <section className="config-hall">
      <AccordionHeader 
        title="КОНФИГУРАЦИЯ ЗАЛОВ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {isOpen && (
        <div className="config-hall-content">
          <div className="config-hall-select">
            <span className="config-hall-select-label">Выберите зал для конфигурации:</span>
            <div className="config-hall-select-buttons">
              {halls.map(hall => (
                <button
                  key={hall.id}
                  className={`config-hall-select-btn ${selectedHall === hall.hall_name ? 'active' : ''}`}
                  onClick={() => setSelectedHall(hall.hall_name)}
                >
                  {hall.hall_name}
                </button>
              ))}
            </div>
          </div>

          <div className="config-hall-rows-seats">
            <p className="config-hall-instruction">
              Укажите количество рядов и максимальное количество кресел в ряду:
            </p>

            <div className="config-hall-inputs">
              <label>
                Рядов, шт
                <input type="number" min="1" value={rows} onChange={onRowsChange} />
              </label>
              <span className="multiply">×</span>
              <label>
                Мест, шт
                <input type="number" min="1" value={seatsPerRow} onChange={onSeatsChange} />
              </label>
            </div>
          </div>

          <p className="config-hall-instruction">
            Теперь вы можете указать типы кресел на схеме зала:
          </p>

          <div className="config-hall-legend">
            <div><span className="legend-box seat-normal" /> — обычные кресла</div>
            <div><span className="legend-box seat-vip" /> — VIP кресла</div>
            <div><span className="legend-box seat-blocked" /> — заблокированные (нет кресла)</div>
          </div>

          <div className="config-hall-instruction-hint">
            Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
          </div>

          <div className="config-hall-seats">
            <div className="screen-label">Э К Р А Н</div>
            <div className="seats-grid">
              {seatTypes.map((row, rowIndex) => (
                <div key={rowIndex} className="d-flex justify-content-center mb-2 seat-row">
                  {row.map((seatType, seatIndex) => {
                    const seatClass =
                      seatType === 0 ? 'seat-normal'
                      : seatType === 1 ? 'seat-vip'
                      : 'seat-blocked';

                    return (
                      <div
                        key={seatIndex}
                        className={`seat ${seatClass} flex-shrink-0 mx-1`}
                        onClick={() => toggleSeatType(rowIndex, seatIndex)}
                        title={`Ряд ${rowIndex + 1}, место ${seatIndex + 1}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="config-hall-buttons">
            <button className="btn btn-cancel">ОТМЕНА</button>
            <button className="btn btn-save">СОХРАНИТЬ</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConfigHalls;
