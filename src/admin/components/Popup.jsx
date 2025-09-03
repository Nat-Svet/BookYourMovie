import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Popup.css';

// Определение компонента Popup с деструктуризацией пропсов
const Popup = ({ visible, title, fields = [], buttons = [], onClose }) => {
  // Если попап не видим, не рендерим ничего
  if (!visible) return null;

  // Содержимое попапа
  const popupContent = (
    // Оверлей (фон) попапа, закрывает попап при клике
    <div className="popup-overlay" onClick={onClose}>
      {/* Основной контейнер попапа, предотвращает всплытие клика */}
      <div className="popup" onClick={e => e.stopPropagation()}>
        {/* Шапка попапа с заголовком и кнопкой закрытия */}
        <div className="popup-header">
          <h2>{title}</h2>
          {/* Кнопка закрытия попапа */}
          <button className="popup-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Тело попапа с полями ввода */}
        <div className="popup-body">
          {/* Маппинг массива полей для отображения различных типов инпутов */}
          {fields.map(({ type, label, name, value, placeholder, options, onChange }, idx) => (
            <div className="popup-field" key={idx}>
              {/* Лейбл для поля ввода */}
              <label>{label}</label>
              {/* Условный рендеринг различных типов полей ввода */}
              {type === 'textarea' ? (
                // Текстовое поле для многострочного ввода
                <textarea
                  name={name}
                  value={value}
                  placeholder={placeholder}
                  onChange={onChange}
                />
              ) : type === 'select' ? (
                // Выпадающий список
                <select name={name} value={value} onChange={onChange}>
                  <option value="">{`Выберите ${label.toLowerCase()}`}</option>
                  {/* Опции выпадающего списка */}
                  {options && options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                // Стандартное поле ввода
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

        {/* Футер попапа с кнопками действий */}
        <div className="popup-footer">
          {/* Маппинг массива кнопок для отображения в футере */}
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

  // Рендеринг попапа через портал в элемент с id 'popup-root'
  return ReactDOM.createPortal(popupContent, document.getElementById('popup-root'));
};


export default Popup;