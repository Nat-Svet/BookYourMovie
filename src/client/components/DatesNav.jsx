import React, { useState, useEffect } from 'react';
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

const DatesNav = ({ onDateChange, selectedDate: externalSelectedDate }) => {
  const [dates, setDates] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
    
    // Устанавливаем активную дату
    if (externalSelectedDate) {
      const index = initialDates.findIndex(
        d => d.dateString === externalSelectedDate
      );
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [externalSelectedDate]);

  const handleDateClick = (index) => {
    setActiveIndex(index);
    if (onDateChange && dates[index]) {
      onDateChange(dates[index].dateString);
    }
  };

  const handleNextClick = () => {
    const lastDateObj = new Date(dates[dates.length - 1].dateObj);
    const nextDateObj = new Date(lastDateObj);
    nextDateObj.setDate(lastDateObj.getDate() + 1);

    const newDate = {
      dayName: formatDayName(nextDateObj),
      dayNumber: formatDayNumber(nextDateObj),
      dateString: formatDateString(nextDateObj),
      dateObj: nextDateObj,
    };

    setDates(prev => {
      const newDates = [...prev.slice(1), newDate];
      return newDates;
    });

    // Активный индекс становится последним (новый день)
    setActiveIndex(dates.length - 1);
    if (onDateChange) {
      onDateChange(newDate.dateString);
    }
  };

  return (
    <nav className="dates-nav">
      <ul className="dates-list">
        {dates.map(({ dayName, dayNumber, dateString }, idx) => (
          <li
            key={dateString}
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