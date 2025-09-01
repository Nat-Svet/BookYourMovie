import React from 'react'; // Импорт библиотеки React //
import '../styles/ClientHeader.css'; // стили //

// Компонент заголовка, отображающий логотип/название сайта //
const Header = () => {
  return (
    // Основной заголовок с классом для стилизации //
    <h1 className="header-title">
      ИДЁМ {/* Обычная часть текста */}
      <span className="header-light">В</span> {/* Выделенная тонким шрифтом часть текста */}
      КИНО {/* Обычная часть текста */}
    </h1>
  );
};

export default Header; // Экспорт компонента по умолчанию //
