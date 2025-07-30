import React from 'react';
import '../styles/Tooltip.css';

export default function Tooltip() {
  return (
    <div className="tooltip-container">
      <img
        src="../../src/assets/icons/hint.png" 
        alt="Двойное касание"
        className="tooltip-icon"
      />
      <div className="tooltip-text">
        Тапните<br />дважды,<br />чтобы<br />увеличить
      </div>
    </div>
  );
}
