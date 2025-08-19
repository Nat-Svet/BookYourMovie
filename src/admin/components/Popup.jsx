// src/components/Popup.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Popup.css';

const Popup = ({ visible, title, fields = [], buttons = [], onClose }) => {
  if (!visible) return null;

  const popupContent = (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="popup-body">
          {fields.map(({ type, label, name, value, placeholder, options, onChange }, idx) => (
            <div className="popup-field" key={idx}>
              <label>{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={value}
                  placeholder={placeholder}
                  onChange={onChange}
                />
              ) : type === 'select' ? (
                <select name={name} value={value} onChange={onChange}>
                  <option value="">{`Выберите ${label.toLowerCase()}`}</option>
                  {options && options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={type}
                  name={name}
                  value={value}
                  placeholder={placeholder}
                  onChange={onChange}
                />
              )}
            </div>
          ))}
        </div>

        <div className="popup-footer">
          {buttons.map(({ text, onClick, className, type }, idx) => (
            <button
              key={idx}
              className={className}
              onClick={onClick}
              type={type || 'button'}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(popupContent, document.getElementById('popup-root'));
};

export default Popup;
