import React from "react";
import QRCode from "react-qr-code";
import "../styles/ETicket.css";

const ETicket = ({ movie, seats, hall, startTime }) => {
  const qrValue = `На фильм: ${movie}\nМеста: ${seats.join(", ")}\nВ зале: ${hall}\nНачало сеанса: ${startTime}`;

  return (
    <div className="ticket-container">
      <h3 className="ticket-title">ЭЛЕКТРОННЫЙ БИЛЕТ</h3>
      
      <div className="ticket-info">
  <p>
    <span className="label">На фильм:</span> <span className="value">{movie}</span>
  </p>
  <p>
    <span className="label">Места:</span> <span className="value">{seats.join(", ")}</span>
  </p>
  <p>
    <span className="label">В зале:</span> <span className="value">{hall}</span>
  </p>
  <p>
    <span className="label">Начало сеанса:</span> <span className="value">{startTime}</span>
  </p>
</div>

      <div className="qr-code">
        <QRCode value={qrValue} size={200} />
      </div>
      <p className="ticket-note">
        Покажите QR-код нашему контроллеру для подтверждения бронирования.
      </p>
      <p className="ticket-note">Приятного просмотра!</p>
    </div>
  );
};

export default ETicket;
