import React, { useState, useEffect } from 'react';
import '../styles/DatesNav.css';

// Функции форматирования
function formatDayName(date) {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
}

function formatDayNumber(date) {
  return date.getDate();
}

function formatDateString(date) {
  return date.toISOString().split('T')[0];
}

// Компонент
const DatesNav = ({ onDateChange, selectedDate: externalSelectedDate }) => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Инициализация
  useEffect(() => {
    const today = new Date();
    const initialDates = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        dayName: formatDayName(date),
        dayNumber: formatDayNumber(date),
        dateString: formatDateString(date),
        dateObj: date,
      };
    });

    setDates(initialDates);

    const initialSelected = externalSelectedDate || formatDateString(today);
    setSelectedDate(initialSelected);

    if (!externalSelectedDate && onDateChange) {
      onDateChange(initialSelected);
    }
  }, []);

  // Клик по дате
  const handleDateClick = (dateString) => {
    setSelectedDate(dateString);
    if (onDateChange) {
      onDateChange(dateString);
    }
  };

  // Кнопка "вперёд"
  const handleNextClick = () => {
    if (!dates.length) return;

    const lastDateObj = new Date(dates[dates.length - 1].dateObj);
    const nextDateObj = new Date(lastDateObj);
    nextDateObj.setDate(lastDateObj.getDate() + 1);

    const newDate = {
      dayName: formatDayName(nextDateObj),
      dayNumber: formatDayNumber(nextDateObj),
      dateString: formatDateString(nextDateObj),
      dateObj: nextDateObj,
    };

    const updatedDates = [...dates.slice(1), newDate];
    setDates(updatedDates);
    setSelectedDate(newDate.dateString);

    if (onDateChange) {
      onDateChange(newDate.dateString);
    }
  };

  // Рендер
  return (
    <nav className="dates-nav">
      <ul className="dates-list">
        {dates.map(({ dayName, dayNumber, dateString }) => (
          <li
            key={dateString}
            className={`date-item ${dateString === selectedDate ? 'active' : ''}`}
            tabIndex={0}
            role="button"
            aria-pressed={dateString === selectedDate}
            onClick={() => handleDateClick(dateString)}
            onKeyDown={(e) => e.key === 'Enter' && handleDateClick(dateString)}
          >
            <div className="day-name">{dayName}</div>
            <div className="day-number">{dayNumber}</div>
          </li>
        ))}

                {/* Кнопка "вперёд" */}
        <li
          className="date-item arrow-button"
          tabIndex={0}
          role="button"
          aria-label="Следующий день"
          onClick={handleNextClick}
          onKeyDown={(e) => e.key === 'Enter' && handleNextClick()}
        >
          &gt;
        </li>
      </ul>
    </nav>
  );
};

export default DatesNav;
