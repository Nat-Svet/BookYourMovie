import React, { useState, useEffect, useMemo } from 'react';
import '../styles/DatesNav.css';

// функция для форматирования названия дня недели (сокращенное) //
function formatDayName(date) {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  return days[date.getDay()];
}

// Функция для форматирования числа дня месяца //
function formatDayNumber(date) {
  return date.getDate();
}

// Функция для форматирования даты в строку формата YYYY-MM-DD,здесь не понятно как она нужна, но пусть будет //
function formatDateString(date) {
  return date.toISOString().split('T')[0];
}

// Функция для построения массива дат на основе смещения //
function buildDates(offset = 0) {
  const today = new Date();
  // Создаем массив из 6 элементов и заполняем датами //
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today);
    // Устанавливаем дату с учетом смещения и индекса //
    date.setDate(today.getDate() + i + offset);
    return {
      dayName: formatDayName(date), // Название дня недели //
      dayNumber: formatDayNumber(date), // Число дня месяца //
      dateString: formatDateString(date), // Дата в формате строки //
      dateObj: date, // Объект даты //
      isToday: offset === 0 && i === 0,  // Флаг, является ли дата сегодняшним днем //
    };
  });
}

// Основной компонент навигации по датам //
const DatesNav = ({ onDateChange, selectedDate: externalSelectedDate }) => {
  // Состояние для хранения смещения дат //
  const [offset, setOffset] = useState(0);
  // Массив дат, пересчитывается при изменении offset //
  const dates = useMemo(() => buildDates(offset), [offset]);
  // Локальное состояние для выбранной даты //
  const [selectedDate, setSelectedDate] = useState(null);

  // Эффект для инициализации выбранной даты //
  useEffect(() => {
    const todayStr = formatDateString(new Date());
    // Используем внешнюю дату или сегодняшнюю дату по умолчанию //
    const initialSelected = externalSelectedDate || todayStr;
    setSelectedDate(initialSelected);
    // Если нет внешней даты и есть колбэк, вызываем его с начальной датой //
    if (!externalSelectedDate && onDateChange) {
      onDateChange(initialSelected);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Обработчик клика по дате //
  const handleDateClick = (dateString) => {
    setSelectedDate(dateString);
    // Вызываем колбэк при изменении даты  //
    if (onDateChange) onDateChange(dateString);
  };

  // Обработчик клика по стрелке //
  const handleNextClick = () => {
    const newOffset = offset + 1; // Увеличиваем смещение //
    setOffset(newOffset);
    // Строим новые даты с новым смещением //
    const nextDates = buildDates(newOffset);
    // Выбираем последнюю дату из нового массива //
    const newSelected = nextDates[nextDates.length - 1].dateString;
    setSelectedDate(newSelected);
    // Вызываем колбэк с новой датой //
    if (onDateChange) onDateChange(newSelected);
  };

  return (
    <nav className="dates-nav">
      <ul className="dates-list">
        {/* Отображаем массив дат */}
        {dates.map(({ dayName, dayNumber, dateString, isToday }) => (
          <li
            key={dateString}
            // Добавляем класс active для выбранной даты //
            className={`date-item ${dateString === selectedDate ? 'active' : ''}`}
            tabIndex={0} // Делаем элемент фокусируемым //
            role="button" // Указываем роль для доступности //
            aria-pressed={dateString === selectedDate} // Состояние для доступности //
            onClick={() => handleDateClick(dateString)}
            // Обработчик нажатия клавиши Enter //
            onKeyDown={(e) => e.key === 'Enter' && handleDateClick(dateString)}
          >
            <div className="day-name">
              {/* Для сегодняшнего дня отображаем "Сегодня" вместо названия дня */}
              {isToday ? 'Сегодня' : dayName}
            </div>
            <div className="day-number">
              {/* Для сегодняшнего дня показываем дополнительную информацию */}
              {isToday ? `${dayName}, ${dayNumber}` : dayNumber}
            </div>
          </li>
        ))}

        {/* Стрелка "вперёд" */}
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
