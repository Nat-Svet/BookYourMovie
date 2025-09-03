import React from 'react';
import arrow from '../../assets/icons/arrow.png'; // импорт стрелки (свернуть - разверуть компонент) //
import '../styles/AccordionHeader.css';

// Принимает три свойства: //
// - title: текст заголовка //
// - isOpen: флаг, открыт ли аккордеон //
// - toggleOpen: функция, которая переключает состояние (открыто/закрыто) //
const AccordionHeader = ({ title, isOpen, toggleOpen }) => {
  return (
    // Контейнер заголовка. При клике вызывается функция toggleOpen //
    <div
      className="accordion-header" // Класс для стилизации //
      onClick={toggleOpen} // Открыть/закрыть по клику //
      role="button" // Делаем div похожим на кнопку для доступности //
      tabIndex={0}  // Добавляем фокус, чтобы можно было нажимать клавишами //
      // Обработка нажатия клавиш Enter или пробела для открытия/закрытия //
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
    >

      {/* Вертикальная линия слева от заголовка) */}
      <span className="accordion-marker" />
      {/* Заголовок аккордеона */}
      <h2 className="accordion-title">{title}</h2>
      {/* Иконка стрелки, меняет ориентацию в зависимости от isOpen */}
      <img
        src={arrow}
        alt={isOpen ? 'Развернуто' : 'Свернуто'}
        className={`accordion-toggle-img ${isOpen ? 'open' : 'closed'}`}
      />
    </div>
  );
};

export default AccordionHeader;
