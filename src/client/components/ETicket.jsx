import React, { useEffect, useRef } from "react";
import QRCode from "qrcode"; // Импорт библиотеки QRCode для генерации QR-кодов //
import "../styles/ETicket.css";

// ВСТРОЕННЫЙ компонент для генерации QR с поддержкой UTF-8
const FixedQRCode = ({ value, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // При изменении value или size вызывается генерация QR-кода //
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, { // передаём ссылку на <canvas> и значение, которое закодируем //
        width: size, // задаём размер //
        errorCorrectionLevel: "M", // уровень коррекции ошибок //
      }, (err) => {
        if (err) console.error("QR Error:", err); // лог ошибок //
      });
    }
  }, [value, size]);  // зависимости — QR обновляется при изменении value или size //

  return <canvas ref={canvasRef} />; // рендер canvas с QR-кодом //
};

// ОСНОВНОЙ КОМПОНЕНТ //

// Принимает данные билета и отображает их с QR-кодом //
const ETicket = ({ movie, seats, hall, startTime }) => {
  // Преобразуем список мест в читаемый текст //
  const seatText = Array.isArray(seats)
    ? seats.map(s => `Ряд ${s.row} место ${s.seat}`).join(", ")
    : seats; // если не массив — используем как есть //

  // Формируем строку, которая будет закодирована в QR-код //
  const qrValue = `Фильм: ${movie}\nМеста: ${seatText}\nЗал: ${hall}\nНачало сеанса: ${startTime}`;

  return (
    <div className="ticket-wrapper"> {/* Обёртка для центрирования или фона */}

      <div className="ticket-container"> {/* Основной блок билета */}
        <h3 className="ticket-title">ЭЛЕКТРОННЫЙ БИЛЕТ</h3>

        {/* Стилизованный разделитель — линия или точки */}
        <div className="dots-separator-container">
          <div className="dots-separator" />
        </div>

        {/* Блок информации о билете */}
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

        {/* QR-код, содержащий данные билета */}
        <div className="qr-code">
          <FixedQRCode value={qrValue} size={200} />
        </div>

        {/* Завершающие примечания */}
        <p className="ticket-note">
          Покажите QR-код нашему контроллеру для подтверждения бронирования.
        </p>
        <p className="ticket-note">Приятного просмотра!</p>
      </div>
    </div>
  );

};

export default ETicket;
