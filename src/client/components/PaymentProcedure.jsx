import React from 'react';
import '../styles/PaymentProcedure.css';

const PaymentProcedure = ({
  film,
  seats,
  hall,
  sessionStart,
  price,
}) => {
  return (
    <div className="payment-container">
      <h3>ВЫ ВЫБРАЛИ БИЛЕТЫ:</h3>
      <p>На фильм: <strong>{film}</strong></p>
      <p>Места: <strong>{seats.join(', ')}</strong></p>
      <p>В зале: <strong>{hall}</strong></p>
      <p>Начало сеанса: <strong>{sessionStart}</strong></p>
      <p>Стоимость: <strong>{price}</strong> рублей</p>

      <button className="payment-button">
        ПОЛУЧИТЬ КОД БРОНИРОВАНИЯ
      </button>

      <p className="payment-info">
        После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.<br />
        Приятного просмотра!
      </p>
    </div>
  );
};

export default PaymentProcedure;
