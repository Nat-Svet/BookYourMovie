import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CinemaHall.css";

export default function CinemaHall() {
  const location = useLocation();
  const { seanceId: seanceIdFromState, sessionDate: sessionDateFromState } = location.state || {};
  const { seanceId: seanceIdFromParams } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const seanceId = seanceIdFromState || seanceIdFromParams || null;
  const sessionDate =
    sessionDateFromState ||
    searchParams.get("date") ||
    new Date().toISOString().split("T")[0];

  const [seatMap, setSeatMap] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!seanceId || !sessionDate) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${sessionDate}`
        );
        if (!res.ok) throw new Error("Не удалось загрузить конфигурацию зала");

        const json = await res.json();
        const cfg = Array.isArray(json) ? json : Array.isArray(json.result) ? json.result : [];
        if (!ignore) setSeatMap(cfg);
      } catch (e) {
        if (!ignore) setError(e.message || "Ошибка загрузки схемы зала");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [seanceId, sessionDate]);

  function handleSelect(row, col) {
    const type = seatMap?.[row]?.[col];
    if (type === "disabled" || type === "taken") return;

    const id = `${row}-${col}`;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  if (loading) {
    return (
      <div className="container py-3 bg-dark text-white cinema-hall-container">
        Загрузка схемы зала...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-3 bg-dark text-white cinema-hall-container">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <div className="container py-3 bg-dark text-white cinema-hall-container">
      <div className="row justify-content-center mb-3">
        <div className="col-auto screen text-center">Экран</div>
      </div>

      {seatMap.map((row, rowIndex) => (
        <div key={rowIndex} className="row justify-content-center seat-row">
          {row.map((seatType, seatIndex) => {
            if (seatType === "disabled") {
              return <div key={seatIndex} className="col-auto seat empty-seat" />;
            }

            const seatId = `${rowIndex}-${seatIndex}`;
            let seatClass = "seat btn btn-sm rounded-0";

            if (seatType === "vip") {
              seatClass += " vip-seat";
            } else if (seatType === "taken") {
              seatClass += " busy-seat";
            } else {
              seatClass += " btn-light free-seat";
            }

            if (selected.includes(seatId)) {
              seatClass = "seat btn btn-sm rounded-0 btn-info selected-seat";
            }

            return (
              <div key={seatIndex} className="col-auto p-0">
                <button
                  className={seatClass}
                  onClick={() => handleSelect(rowIndex, seatIndex)}
                  title={`Ряд ${rowIndex + 1}, место ${seatIndex + 1}`}
                  type="button"
                  disabled={seatType === "taken"}
                >
                  {seatIndex + 1}
                </button>
              </div>
            );
          })}
        </div>
      ))}

      {/* Легенда */}
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
