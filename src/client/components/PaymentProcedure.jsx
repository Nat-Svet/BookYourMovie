import React from 'react';
import '../styles/PaymentProcedure.css';

const PaymentProcedure = ({
  film,
  seats,
  hall,
  sessionStart,
  price,
  onComplete // ← добавляем пропс
}) => {
  return (

<div className="payment-wrapper">

    <div className="payment-container">
      <h3>ВЫ ВЫБРАЛИ БИЛЕТЫ:</h3> 

<div className="dot-separator-container">
  <div className="dot-separator" />
</div>

      <p>На фильм: <strong>{film}</strong></p>
      <p>Места: <strong>{
        Array.isArray(seats)
          ? seats.map(s => `Ряд ${s.row} место ${s.seat}`).join(', ')
          : seats
      }</strong></p>
      <p>В зале: <strong>{hall}</strong></p>
      <p>Начало сеанса: <strong>{sessionStart}</strong></p>
      <p>Стоимость: <strong>{price}</strong> рублей</p>

      <button className="payment-button" onClick={onComplete}>
        ПОЛУЧИТЬ КОД БРОНИРОВАНИЯ
      </button>

      <p className="payment-info">
        После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.<br />
        Приятного просмотра!
      </p>
    </div>

    </div>
  );
};

export default PaymentProcedure;
