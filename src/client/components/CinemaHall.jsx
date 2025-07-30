import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CinemaHall.css";

const seatMap = [
  ["empty","empty","empty","empty","empty","empty","free","free","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","free","free","free","free","empty","empty","empty","empty"],
  ["empty","free","free","free","free","free","free","free","free","empty","empty","empty"],
  ["free","free","free","free","free","vip","vip","free","free","empty","empty","empty"],
  ["free","free","free","free","vip","vip","vip","vip","free","empty","empty","empty"],
  ["free","free","free","free","vip","vip","vip","vip","free","empty","empty","empty"],
  ["free","free","free","free","vip","vip","vip","vip","free","empty","empty","empty"],
  ["free","free","free","free","free","free","free","free","free","empty","empty","empty"],
  ["free","free","free","free","free","free","free","free","free","free","free","free"],
  ["free","free","free","free","free","free","free","free","free","free","free","free"]
];

export default function CinemaHall() {
  const [selected, setSelected] = useState([]); // массив выбранных мест

  function handleSelect(row, seat) {
    if (seatMap[row][seat] === "empty") return;

    const seatId = `${row}-${seat}`; // уникальный id места
    if (selected.includes(seatId)) {
      // если место уже выбрано — убираем из массива
      setSelected(selected.filter(id => id !== seatId));
    } else {
      // иначе добавляем в массив выбранных
      setSelected([...selected, seatId]);
    }
  }

  return (
    <div className="container py-3 bg-dark text-white cinema-hall-container">
      <div className="row mb-3">
        <div className="col-12 screen text-center">Экран</div>
      </div>

      {seatMap.map((row, rowIndex) => (
        <div key={rowIndex} className="seat-row">
          {row.map((seat, seatIndex) => {
            if (seat === "empty") {
              return <div key={seatIndex} className="seat empty-seat" />;
            }

            const seatId = `${rowIndex}-${seatIndex}`;
            let seatClass = "seat btn btn-sm rounded-0";
            if (seat === "vip") seatClass += " vip-seat";
            else seatClass += " btn-light";

            if (selected.includes(seatId)) {
              seatClass = "seat btn btn-sm rounded-0 btn-info";
            }

            return (
              <button
                key={seatIndex}
                className={seatClass}
                onClick={() => handleSelect(rowIndex, seatIndex)}
                title={`Ряд ${rowIndex + 1}, место ${seatIndex + 1}`}
                type="button"
              >
                {seatIndex + 1}
              </button>
            );
          })}
        </div>
      ))}

<div className="legend d-flex justify-content-center gap-2 mt-4">
  <div className="legend-column d-flex flex-column gap-3">
    <div className="legend-item d-flex align-items-center gap-2">
      <div className="legend-color free-seat"></div>
      <span>Свободно (250руб)</span>
    </div>
    <div className="legend-item d-flex align-items-center gap-2">
      <div className="legend-color vip-seat"></div>
      <span>Свободно VIP (350руб)</span>
    </div>
  </div>
  <div className="legend-column d-flex flex-column gap-3">
    <div className="legend-item d-flex align-items-center gap-2">
      <div className="legend-color busy-seat"></div>
      <span>Занято</span>
    </div>
    <div className="legend-item d-flex align-items-center gap-2">
      <div className="legend-color selected-seat"></div>
      <span>Выбрано</span>
    </div>
  </div>
</div>


    </div>
  );
}


