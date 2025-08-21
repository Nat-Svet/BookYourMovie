// Импорт необходимых модулей и компонентов React
import React, { useState } from 'react';
// Импорт иконки корзины для удаления
import trash from '../../assets/icons/trash.png';
// Импорт компонента заголовка аккордеона
import AccordionHeader from './AccordionHeader';
// Импорт компонента всплывающего окна
import Popup from './Popup';
// Импорт CSS стилей для компонента
import '../styles/ManageHalls.css';

// Основной компонент для управления кинозалами
const ManageHalls = ({ halls, onAddHall, onDeleteHall }) => {
  // Состояние для отслеживания открыто/закрыто аккордеона
  const [isOpen, setIsOpen] = useState(true);
  // Состояние для отображения/скрытия всплывающего окна
  const [popupVisible, setPopupVisible] = useState(false);
  // Состояние для хранения названия нового зала
  const [newHallName, setNewHallName] = useState('');

  // Функция переключения состояния аккордеона
  const toggleOpen = () => setIsOpen(!isOpen);
  
  // Функция открытия всплывающего окна
  const openPopup = () => {
    setNewHallName(''); // Очищаем поле ввода
    setPopupVisible(true); // Показываем попап
  };
  
  // Функция закрытия всплывающего окна
  const closePopup = () => {
    setPopupVisible(false); // Скрываем попап
    setNewHallName(''); // Очищаем поле ввода
  };

  // Функция обработки добавления нового зала
  const handleAddHall = () => {
    const trimmed = newHallName.trim(); // Удаляем лишние пробелы
    // Проверяем валидность введенных данных
    if (!trimmed || trimmed.length < 2) {
      alert('Введите корректное название зала (не менее 2 символов)');
      return;
    }
    // Вызываем переданную функцию добавления зала
    onAddHall(trimmed);
    closePopup(); // Закрываем попап после добавления
  };

  // Рендеринг компонента
  return (
    <section className="manage-halls">
      {/* Компонент заголовка аккордеона с обработчиком клика */}
      <AccordionHeader
        title="УПРАВЛЕНИЕ ЗАЛАМИ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      {/* Визуальный разделитель */}
      <div className="vertical-line"></div>

      {/* Условный рендеринг содержимого аккордеона */}
      {isOpen && (
        <div className="manage-halls-content">
          {/* Заголовок списка залов */}
          <p>Доступные залы:</p>
          {/* Список доступных залов */}
          <ul className="manage-halls-list">
            {/* Отображение каждого зала в виде элемента списка */}
            {halls.map(hall => (
              <li key={hall.id}>
                — {hall.hall_name}{' '}
                {/* Кнопка удаления зала */}
                <button
                  className="manage-halls-delete"
                  title="Удалить зал"
                  onClick={() => onDeleteHall(hall.id)}
                >
                  {/* Иконка корзины для удаления */}
                  <img src={trash} alt="Удалить зал" className="trash-icon" />
                </button>
              </li>
            ))}
          </ul>

          {/* Кнопка создания нового зала */}
          <button className="manage-halls-create" onClick={openPopup}>
            СОЗДАТЬ ЗАЛ
          </button>
        </div>
      )}

      {/* Компонент всплывающего окна для добавления нового зала */}
      <Popup
        visible={popupVisible}
        title="ДОБАВЛЕНИЕ ЗАЛА"
        fields={[
          {
            type: 'text',
            label: 'Название зала',
            name: 'hallName',
            value: newHallName,
            placeholder: 'Например, «Зал 1»',
            onChange: e => setNewHallName(e.target.value),
          },
        ]}
        buttons={[
          { text: 'Добавить зал', onClick: handleAddHall, className: 'btn-add' },
          { text: 'Отменить', onClick: closePopup, className: 'btn-cancel' },
        ]}
        onClose={closePopup}
      />
    </section>
  );
};

// Экспорт компонента для использования в других частях приложения
export default ManageHalls;