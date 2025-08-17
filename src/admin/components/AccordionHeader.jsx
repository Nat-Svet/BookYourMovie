import React from 'react';
import arrow from '../../assets/icons/arrow.png';
import '../styles/AccordionHeader.css';

const AccordionHeader = ({ title, isOpen, toggleOpen }) => {
  return (
    <div
      className="accordion-header"
      onClick={toggleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleOpen(); }}
    >
      <span className="accordion-marker" />
      <h2 className="accordion-title">{title}</h2>
      <img
        src={arrow}
        alt={isOpen ? 'Развернуто' : 'Свернуто'}
        className={`accordion-toggle-img ${isOpen ? 'open' : 'closed'}`}
      />
    </div>
  );
};

export default AccordionHeader;
