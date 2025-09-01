import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import "../styles/ETicket.css";

// ВСТРОЕННЫЙ компонент для генерации QR с поддержкой UTF-8
const FixedQRCode = ({ value, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        errorCorrectionLevel: "M",
      }, (err) => {
        if (err) console.error("QR Error:", err);
      });
    }
  }, [value, size]);

  return <canvas ref={canvasRef} />;
};

// ОСНОВНОЙ КОМПОНЕНТ
const ETicket = ({ movie, seats, hall, startTime }) => {
  const seatText = Array.isArray(seats)
  ? seats.map(s => `Ряд ${s.row} место ${s.seat}`).join(", ")
  : seats;

  const qrValue = `Фильм: ${movie}\nМеста: ${seatText}\nЗал: ${hall}\nНачало сеанса: ${startTime}`;

  return (
    <div className="ticket-wrapper">
    
    <div className="ticket-container">
      <h3 className="ticket-title">ЭЛЕКТРОННЫЙ БИЛЕТ</h3>

      <div className="dots-separator-container">
  <div className="dots-separator" />
</div>

      <div className="ticket-info">
        <p>
          <span className="label">На фильм:</span>{" "}
          <span className="value">{movie}</span>
        </p>
        <p>
          <span className="label">Места:</span>{" "}
          <span className="value">{seatText}</span>
        </p>
        <p>
          <span className="label">В зале:</span>{" "}
          <span className="value">{hall}</span>
        </p>
        <p>
          <span className="label">Начало сеанса:</span>{" "}
          <span className="value">{startTime}</span>
        </p>
      </div>

      <div className="qr-code">
        <FixedQRCode value={qrValue} size={200} />
      </div>

      <p className="ticket-note">
        Покажите QR-код нашему контроллеру для подтверждения бронирования.
      </p>
      <p className="ticket-note">Приятного просмотра!</p>
    </div>
    </div>
  );
  
};

export default ETicket;
