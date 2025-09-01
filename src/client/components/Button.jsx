import React from "react"; //импорт react //
import "../styles/Button.css"; //стили //

//основной компонент кнопки //

//внутри: содержимое кнопки, размер, доп. классы в css, остальные свойства кнопки //
export default function Button({ children, size = "medium", className = "", ...props }) {
  
  return (
    
    <button
    
      className={`custom-button custom-button--${size} ${className}`} // Формируем строку классов: базовый класс + класс размера + переданные классы //
      type="button" // Тип кнопки (предотвращает отправку форм по умолчанию)
      {...props} // Распаковываем переданные свойства
    >
      {children} {/* Отображаем содержимое кнопки */}

   
    </button>
  );
}
