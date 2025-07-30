import React, { useState } from 'react';
import '../styles/DatesNav.css';

function formatDayName(date) {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
}

function formatDayNumber(date) {
  return date.getDate();
}

const DatesNav = ({ onDateChange }) => {
  const today = new Date();

  const initialDates = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      dayName: formatDayName(date),
      dayNumber: formatDayNumber(date),
      dateObj: date,
    };
  });

  const [dates, setDates] = useState(initialDates);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDateClick = (index) => {
    setActiveIndex(index);
    if (onDateChange) onDateChange(dates[index]);
  };

  const handleNextClick = () => {
    const lastDateObj = dates[dates.length - 1].dateObj;
    const nextDateObj = new Date(lastDateObj);
    nextDateObj.setDate(nextDateObj.getDate() + 1);

    const newDate = {
      dayName: formatDayName(nextDateObj),
      dayNumber: formatDayNumber(nextDateObj),
      dateObj: nextDateObj,
    };

    setDates((prev) => {
      let newDates = [...prev, newDate];
      if (newDates.length > 6) {
        newDates = newDates.slice(1);
      }
      return newDates;
    });

    setActiveIndex(5);
    if (onDateChange) onDateChange(newDate);
  };

  return (
    <nav className="dates-nav">
      <ul className="dates-list">
        {dates.map(({ dayName, dayNumber }, idx) => (
          <li
            key={idx}
            className={`date-item ${idx === activeIndex ? 'active' : ''}`}
            tabIndex={0}
            role="button"
            aria-pressed={idx === activeIndex}
            onClick={() => handleDateClick(idx)}
            onKeyDown={(e) => e.key === 'Enter' && handleDateClick(idx)}
          >
            <div className="day-name">{dayName}</div>
            <div className="day-number">{dayNumber}</div>
          </li>
        ))}

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


