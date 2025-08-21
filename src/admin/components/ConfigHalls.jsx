// Импорт необходимых модулей React и Bootstrap
import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
// Импорт компонента заголовка аккордеона
import AccordionHeader from './AccordionHeader';
// Импорт стилей для компонента конфигурации залов
import '../styles/ConfigHalls.css';
// Импорт API для взаимодействия с сервером
import API from '../../api/api';

// Создание экземпляра API
const api = new API();

// Основной компонент для конфигурации залов
const ConfigHalls = ({ halls }) => {
  // Состояние для отслеживания открыто/закрыто аккордеона
  const [isOpen, setIsOpen] = useState(true);
  // Состояние для хранения выбранного зала
  const [selectedHall, setSelectedHall] = useState(halls.length > 0 ? halls[0].hall_name : '');
  // Состояние для количества рядов
  const [rows, setRows] = useState(10);
  // Состояние для количества мест в ряду
  const [seatsPerRow, setSeatsPerRow] = useState(8);
  // Состояние для типов мест (0 - обычное, 1 - VIP, 2 - заблокированное)
  const [seatTypes, setSeatTypes] = useState(
    Array(rows).fill(null).map(() => Array(seatsPerRow).fill(0))
  );
  // Состояние для отображения статуса загрузки
  const [isLoading, setIsLoading] = useState(false);

  // Функция переключения состояния аккордеона
  const toggleOpen = () => setIsOpen(!isOpen);

  // Эффект для обновления схемы мест при изменении количества рядов или мест
  useEffect(() => {
    setSeatTypes(
      Array(rows).fill(null).map(() => Array(seatsPerRow).fill(0))
    );
  }, [rows, seatsPerRow]);

  // Функция изменения типа места при клике
  const toggleSeatType = (rowIndex, seatIndex) => {
    setSeatTypes(prev => {
      const newSeatTypes = prev.map(r => [...r]);
      const currentType = newSeatTypes[rowIndex][seatIndex];
      newSeatTypes[rowIndex][seatIndex] = (currentType + 1) % 3;
      return newSeatTypes;
    });
  };

  // Обработчик изменения количества рядов
  const onRowsChange = e => {
    const value = Number(e.target.value);
    if (value > 0) setRows(value);
  };

  // Обработчик изменения количества мест в ряду
  const onSeatsChange = e => {
    const value = Number(e.target.value);
    if (value > 0) setSeatsPerRow(value);
  };

  // Эффект для обновления выбранного зала при изменении списка залов
  useEffect(() => {
    if (halls.length > 0 && !halls.find(h => h.hall_name === selectedHall)) {
      setSelectedHall(halls[0].hall_name);
    }
  }, [halls, selectedHall]);

  // Функция для сохранения конфигурации зала
  const handleSave = async () => {
    // Находим ID выбранного зала
    const hall = halls.find(h => h.hall_name === selectedHall);
    if (!hall) {
      alert('Зал не найден');
      return;
    }

    setIsLoading(true);

    try {
      // Преобразуем числовые типы мест в строковые согласно API
      const config = seatTypes.map(row => 
        row.map(seatType => {
          switch(seatType) {
            case 0: return 'standart';
            case 1: return 'vip';
            case 2: return 'disabled';
            default: return 'standart';
          }
        })
      );

      // Подготавливаем данные для отправки
      const payload = {
        rowCount: rows,
        placeCount: seatsPerRow,
        config: JSON.stringify(config)
      };

      // Отправляем запрос на сервер
      const result = await api.request(`/hall/${hall.id}`, {
        method: 'POST',
        body: payload
      });

      console.log('Конфигурация зала успешно сохранена:', result);
      alert('Конфигурация зала успешно сохранена!');
    } catch (error) {
      console.error('Ошибка при сохранении конфигурации зала:', error);
      alert('Ошибка при сохранении конфигурации зала: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для отмены изменений
  const handleCancel = () => {
    // Сброс состояний к исходным значениям
    setRows(10);
    setSeatsPerRow(8);
    setSeatTypes(Array(10).fill(null).map(() => Array(8).fill(0)));
  };

  // Рендеринг компонента
  return (
    <section className="config-hall">
      {/* Заголовок аккордеона */}
      <AccordionHeader 
        title="КОНФИГУРАЦИЯ ЗАЛОВ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      {/* Визуальный разделитель */}
      <div className="vertical-line-container">
        <div className="vertical-line top-part"></div>
        <div className="vertical-line bottom-part"></div>
      </div>

      {/* Условный рендеринг содержимого аккордеона */}
      {isOpen && (
        <div className="config-hall-content">
          {/* Выбор зала для конфигурации */}
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

          {/* Настройка количества рядов и мест */}
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

          {/* Инструкция по настройке типов кресел */}
          <p className="config-hall-instruction">
            Теперь вы можете указать типы кресел на схеме зала:
          </p>

          {/* Легенда типов мест */}
          <div className="config-hall-legend">
            <div><span className="legend-box seat-normal" /> — обычные кресла</div>
            <div><span className="legend-box seat-vip" /> — VIP кресла</div>
            <div><span className="legend-box seat-blocked" /> — заблокированные (нет кресла)</div>
          </div>

          {/* Подсказка по взаимодействию */}
          <div className="config-hall-instruction-hint">
            Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши
          </div>

          {/* Визуализация схемы зала */}
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

          {/* Кнопки действий */}
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
              {isLoading ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

// Экспорт компонента
export default ConfigHalls;