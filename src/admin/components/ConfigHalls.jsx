
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import AccordionHeader from './AccordionHeader';
import '../styles/ConfigHalls.css';
import API from '../../api/api';

const api = new API();

const ConfigHalls = ({ halls }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].hall_name : '');
  const [rowsInput, setRowsInput] = useState("10");
  const [seatsInput, setSeatsInput] = useState("8");
  const [seatTypes, setSeatTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // базовая конфигурация (без занятости) по залу
  
  const [hallConfigs, setHallConfigs] = useState({});
  const [loadedFromServer, setLoadedFromServer] = useState(false);

  const rows = parseInt(rowsInput, 10) || 1;
  const seatsPerRow = parseInt(seatsInput, 10) || 1;

  const toggleOpen = () => setIsOpen(!isOpen);

  
  const toNumericType = (t) => {
    switch (t) {
      case 'standart': return 0;
      case 'vip': return 1;
      case 'disabled': return 2;
      default: return 0;
    }
  };

  
  const toStringType = (v) => {
    if (v === 'taken') return 'standart'; 
    switch (v) {
      case 0: return 'standart';
      case 1: return 'vip';
      case 2: return 'disabled';
      default: return 'standart';
    }
  };

  
  const applyTakenOverlay = async (baseSeatTypes, hallId, seances) => {
    const today = new Date().toISOString().split('T')[0];
    const hallSeances = seances.filter(s => s.seance_hallid === hallId);

    const taken = {}; 
    for (const seance of hallSeances) {
      try {
        const cfg = await api.getSeanceHallConfig(seance.id, today); 
        (cfg || []).forEach((row, r) => {
          row.forEach((cell, c) => {
            if (cell === 'taken') taken[`${r}-${c}`] = true;
          });
        });
      } catch (e) {
        
      }
    }

    
    return baseSeatTypes.map((row, r) =>
      row.map((cell, c) => (taken[`${r}-${c}`] ? 'taken' : cell))
    );
  };

  
  useEffect(() => {
    const fetchHallConfig = async () => {
      const hall = halls.find(h => h.hall_name === selectedHall);
      if (!hall) return;

      setIsLoading(true);
      try {
        const allData = await api.getAllData();
        const hallData = allData.halls.find(h => h.id === hall.id);

        if (!hallData) {
          
          setRowsInput("10");
          setSeatsInput("8");
          setSeatTypes(Array(10).fill(null).map(() => Array(8).fill(0)));
          setLoadedFromServer(false);
          return;
        }

        let baseRows, baseSeats, baseSeatTypes;

        
        if (hallConfigs[hall.id]) {
          baseRows = hallConfigs[hall.id].rows;
          baseSeats = hallConfigs[hall.id].seats;
          baseSeatTypes = hallConfigs[hall.id].baseSeatTypes;
        } else {
          const config = hallData.hall_config || [];
          baseRows = parseInt(hallData.hall_rows, 10) || config.length || 10;
          baseSeats = parseInt(hallData.hall_places, 10) || (config[0]?.length || 8);

          baseSeatTypes = Array.from({ length: baseRows }, (_, r) =>
            Array.from({ length: baseSeats }, (_, c) => toNumericType(config?.[r]?.[c] ?? 'standart'))
          );

          setHallConfigs(prev => ({
            ...prev,
            [hall.id]: { rows: baseRows, seats: baseSeats, baseSeatTypes }
          }));
        }

        
        const withTaken = await applyTakenOverlay(baseSeatTypes, hall.id, allData.seances);

        setRowsInput(String(baseRows));
        setSeatsInput(String(baseSeats));
        setSeatTypes(withTaken);
        setLoadedFromServer(true);
      } catch (error) {
        console.error('Ошибка при загрузке конфигурации зала:', error);
        alert('Ошибка при загрузке конфигурации зала: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHallConfig();
    
  }, [selectedHall, halls]); 


  

  
  useEffect(() => {
    if (!loadedFromServer) {
      setSeatTypes(
        Array(rows).fill(null).map(() => Array(seatsPerRow).fill(0))
      );
    }
  }, [rows, seatsPerRow, loadedFromServer]);

  const onRowsChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setRowsInput(value);
      setIsSaved(false);
      setLoadedFromServer(false);
    }
  };

  const onSeatsChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setSeatsInput(value);
      setIsSaved(false);
      setLoadedFromServer(false);
    }
  };

  const toggleSeatType = (rowIndex, seatIndex) => {
    
    if (seatTypes[rowIndex][seatIndex] === 'taken') return;

    setSeatTypes(prev => {
      const next = prev.map(r => [...r]);
      const cur = next[rowIndex][seatIndex];
      
      const value = typeof cur === 'number' ? cur : 0;
      next[rowIndex][seatIndex] = (value + 1) % 3; // 0 -> 1 -> 2 -> 0
      return next;
    });
    setIsSaved(false);
    setLoadedFromServer(false);
  };

  const handleSave = async () => {
    const hall = halls.find(h => h.hall_name === selectedHall);
    if (!hall) {
      alert('Зал не найден');
      return;
    }

    setIsLoading(true);
    try {
      
      const config = seatTypes.map(row =>
        row.map(toStringType)
      );

      const payload = {
        rowCount: rows,
        placeCount: seatsPerRow,
        config: JSON.stringify(config)
      };

      const result = await api.request(`/hall/${hall.id}`, {
        method: 'POST',
        body: payload
      });

      
      const baseSeatTypes = seatTypes.map(row =>
        row.map(cell => (cell === 'taken' ? 0 : cell)) 
      );

      setHallConfigs(prev => ({
        ...prev,
        [hall.id]: { rows, seats: seatsPerRow, baseSeatTypes }
      }));

      setIsSaved(true);
      alert('Конфигурация зала успешно сохранена!');
      setLoadedFromServer(true);
      console.log("✅ Ответ сервера:", result);
    } catch (error) {
      console.error('Ошибка при сохранении конфигурации зала:', error);
      alert('Ошибка при сохранении конфигурации зала: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHallSelect = (hallName) => {
    setSelectedHall(hallName);
    setIsSaved(false);
  };

  const handleCancel = () => {
    setRowsInput("10");
    setSeatsInput("8");
    setSeatTypes(Array(10).fill(null).map(() => Array(8).fill(0)));
    setIsSaved(false);
    setLoadedFromServer(false);
  };

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
                  onClick={() => handleHallSelect(hall.hall_name)}
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
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={rowsInput}
                  onChange={onRowsChange}
                />
              </label>
              <span className="multiply">×</span>
              <label>
                Мест, шт
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={seatsInput}
                  onChange={onSeatsChange}
                />
              </label>
            </div>
          </div>

          <p className="config-hall-instruction">
            Теперь вы можете указать типы кресел на схеме зала:
          </p>

          <div className="config-hall-legend">
            <div><span className="legend-box seat-normal" /> — обычные кресла</div>
            <div><span className="legend-box seat-vip" /> — VIP кресла</div>
           {/* <div><span className="legend-box seat-blocked" /> — заблокированные (нет кресла)</div> */}
            <div><span className="legend-box seat-taken" /> — заблокированные (нет кресла)</div>
          </div>

          <div className="config-hall-instruction-hint">
            Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
          </div>

          <div className="config-hall-seats">
            <div className="screen-label">Э К Р А Н</div>
            <div className="seats-grid-wrapper">
              <div className="seats-grid">
                {seatTypes.map((row, rowIndex) => (
                  <div key={rowIndex} className="d-flex justify-content-center mb-2 seat-row">
                    {row.map((seatType, seatIndex) => {
                      const seatClass =
                        seatType === 0 ? 'seat-normal'
                          : seatType === 1 ? 'seat-vip'
                            : seatType === 2 ? 'seat-blocked'
                              : seatType === 'taken' ? 'seat-taken'
                                : 'seat-normal';

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
          </div>

          <div className="config-hall-buttons">
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
              {isLoading
                ? 'СОХРАНЕНИЕ...'
                : isSaved
                  ? 'СОХРАНЕНО!'
                  : 'СОХРАНИТЬ'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ConfigHalls;
