import React, { useState, useEffect, useMemo } from 'react';
import '../styles/DatesNav.css';

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

// Строим массив из 6 дат начиная с offset
function buildDates(offset = 0) {
  const today = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i + offset);
    return {
      dayName: formatDayName(date),
      dayNumber: formatDayNumber(date),
      dateString: formatDateString(date),
      dateObj: date,
      isToday: offset === 0 && i === 0,
    };
  });
}

const DatesNav = ({ onDateChange, selectedDate: externalSelectedDate }) => {
  const [offset, setOffset] = useState(0);
  const dates = useMemo(() => buildDates(offset), [offset]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const todayStr = formatDateString(new Date());
    const initialSelected = externalSelectedDate || todayStr;
    setSelectedDate(initialSelected);
    if (!externalSelectedDate && onDateChange) {
      onDateChange(initialSelected);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateClick = (dateString) => {
    setSelectedDate(dateString);
    if (onDateChange) onDateChange(dateString);
  };

  const handleNextClick = () => {
    const newOffset = offset + 1;
    setOffset(newOffset);
    const nextDates = buildDates(newOffset);
    const newSelected = nextDates[nextDates.length - 1].dateString;
    setSelectedDate(newSelected);
    if (onDateChange) onDateChange(newSelected);
  };

  return (
    <nav className="dates-nav">
      <ul className="dates-list">
        {dates.map(({ dayName, dayNumber, dateString, isToday }) => (
          <li
            key={dateString}
            className={`date-item ${dateString === selectedDate ? 'active' : ''}`}
            tabIndex={0}
            role="button"
            aria-pressed={dateString === selectedDate}
            onClick={() => handleDateClick(dateString)}
            onKeyDown={(e) => e.key === 'Enter' && handleDateClick(dateString)}
          >
            <div className="day-name">
              {isToday ? 'Сегодня' : dayName}
            </div>
            <div className="day-number">
              {isToday ? `${dayName}, ${dayNumber}` : dayNumber}
            </div>
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
