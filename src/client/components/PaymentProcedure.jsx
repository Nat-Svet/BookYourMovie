import React from 'react';
import '../styles/PaymentProcedure.css';

const PaymentProcedure = ({
  film,
  seats,
  hall,
  sessionStart,
  price,
  onComplete // функция, вызываемая при нажатии кнопки //
}) => {
  return (

    // Внешний контейнер для перфорации //
    <div className="payment-wrapper">

      {/* Основной блок с содержимым */}
      <div className="payment-container">
        <h3>ВЫ ВЫБРАЛИ БИЛЕТЫ:</h3>

        {/* Декоративный разделитель (точки) */}
        <div className="dot-separator-container">
          <div className="dot-separator" />
        </div>

        {/* Информация о выбранных параметрах: */}

        {/* Название фильма */}
        <p>На фильм: <strong>{film}</strong></p>

        {/* Выбранные места. Если это массив — отображаем все места в виде "Ряд ... место ..." */}
        <p>Места: <strong>{
          Array.isArray(seats)
            ? seats.map(s => `Ряд ${s.row} место ${s.seat}`).join(', ')
            : seats // если seats не массив — просто покажем как есть //
        }</strong></p>

        {/* Название зала */}
        <p>В зале: <strong>{hall}</strong></p>

        {/* Время начала сеанса */}
        <p>Начало сеанса: <strong>{sessionStart}</strong></p>

        {/* Общая стоимость билетов */}
        <p>Стоимость: <strong>{price}</strong> рублей</p>

        {/* Кнопка, при нажатии на которую вызывается функция onComplete */}
        <button className="payment-button" onClick={onComplete}>
          ПОЛУЧИТЬ КОД БРОНИРОВАНИЯ
        </button>

        {/* Дополнительная информация для пользователя */}
        <p className="payment-info">
          После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.<br />
          Приятного просмотра!
        </p>
      </div>

    </div>
  );
};

export default PaymentProcedure;
