import React, { useState } from 'react';
import trash from '../../assets/icons/trash.png';
import AccordionHeader from './AccordionHeader';
import Popup from './Popup';
import '../styles/ManageHalls.css';

const ManageHalls = ({ halls, addHall, deleteHall }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [newHallName, setNewHallName] = useState('');

  const toggleOpen = () => setIsOpen(!isOpen);
  const openPopup = () => {
    setNewHallName('');
    setPopupVisible(true);
  };
  const closePopup = () => {
    setPopupVisible(false);
    setNewHallName('');
  };

  const handleAddHall = () => {
    if (newHallName.trim() === '') {
      alert('Введите название зала');
      return;
    }
    console.log('📩 Нажата кнопка "Добавить зал"', newHallName);
    addHall(newHallName.trim());
    closePopup();
  };

  console.log('🔁 Получено halls:', halls);

  return (
    <section className="manage-halls">
      <AccordionHeader
        title="УПРАВЛЕНИЕ ЗАЛАМИ"
        isOpen={isOpen}
        toggleOpen={toggleOpen}
      />

      <div className="vertical-line"></div>

      {isOpen && (
        <div className="manage-halls-content">
          <p>Доступные залы:</p>
         <ul className="manage-halls-list">
  {halls.map(hall => (
    <li key={hall.id}>
      — {hall.hall_name}{' '}
      <button
        className="manage-halls-delete"
        title="Удалить зал"
        onClick={() => deleteHall(hall.id)}
      >
        <img src={trash} alt="Удалить зал" className="trash-icon" />
      </button>
    </li>
  ))}
</ul>

          <button className="manage-halls-create" onClick={openPopup}>
            СОЗДАТЬ ЗАЛ
          </button>
        </div>
      )}

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

export default ManageHalls;
