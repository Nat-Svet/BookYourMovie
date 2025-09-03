import React from 'react';
import '../styles/Tooltip.css';


// Объявляем и экспортируем всплывающую подсказку) //
export default function Tooltip() {
  return (

    // Контейнер подсказки, включает иконку и текст //
    <div className="tooltip-container">

      {/* Иконка подсказки  */}
      <img
        src="../../src/assets/icons/hint.png"
        alt="Двойное касание"
        className="tooltip-icon"
      />

      {/* Текст подсказки рядом с иконкой */}
      <div className="tooltip-text">
        Тапните<br />дважды,<br />чтобы<br />увеличить
      </div>
    </div>
  );
}
