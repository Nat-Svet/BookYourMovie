import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CinemaHall.css";

export default function CinemaHall({
  seanceId: propSeanceId,
  sessionDate: propSessionDate,
  onSelectionChange,
}) {
  const location = useLocation();
  const { seanceId: seanceIdFromParams } = useParams();

  const seanceId = propSeanceId || seanceIdFromParams || null;
  const sessionDate = propSessionDate || new Date().toISOString().split("T")[0];

  const [seatMap, setSeatMap] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [standardPrice, setStandardPrice] = useState(null);
  const [vipPrice, setVipPrice] = useState(null);

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

        // 1) Конфигурация зала
        const res = await fetch(
          `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${sessionDate}`
        );
        if (!res.ok) throw new Error("Не удалось загрузить конфигурацию зала");

        const json = await res.json();
        const cfg = Array.isArray(json) ? json : Array.isArray(json.result) ? json.result : [];
        if (!ignore) setSeatMap(cfg);

        // 2) Общие данные (для цен)
        const resAll = await fetch("https://shfe-diplom.neto-server.ru/alldata");
        if (!resAll.ok) throw new Error("Не удалось загрузить данные о зале");

        const allData = await resAll.json();
        const { halls, seances } = allData?.result || {};
        if (!Array.isArray(seances)) throw new Error("Некорректные данные сеансов");
        if (!Array.isArray(halls)) throw new Error("Некорректные данные залов");

        const foundSeance = seances.find((s) => s.id === Number(seanceId));
        if (!foundSeance) throw new Error("Сеанс не найден");

        const foundHall = halls.find((h) => h.id === foundSeance.seance_hallid);
        if (!foundHall) throw new Error("Зал не найден");

        if (!ignore) {
          setStandardPrice(foundHall.hall_price_standart);
          setVipPrice(foundHall.hall_price_vip);
        }
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

  // Считаем выбранные места и сумму и сообщаем родителю
  useEffect(() => {
    if (!seatMap.length || standardPrice == null || vipPrice == null) return;

    const selectedSeats = selected.map((id) => {
      const [row, col] = id.split("-").map(Number);
      return { row: row + 1, seat: col + 1, type: seatMap[row]?.[col] };
    });

    const totalPrice = selectedSeats.reduce(
      (sum, s) => sum + (s.type === "vip" ? vipPrice : standardPrice),
      0
    );

    // ВАЖНО: сам колбэк в родителе теперь мемоизирован, поэтому цикла не будет
    onSelectionChange?.(selectedSeats, totalPrice);
  }, [selected, seatMap, standardPrice, vipPrice, onSelectionChange]);

  function handleSelect(row, col) {
    const type = seatMap?.[row]?.[col];
    if (type === "disabled" || type === "taken") return;
    const id = `${row}-${col}`;
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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

            if (seatType === "vip") seatClass += " vip-seat";
            else if (seatType === "taken") seatClass += " busy-seat";
            else seatClass += " btn-light free-seat";

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
            <span>Свободно ({standardPrice ?? "—"} руб)</span>
          </div>
          <div className="legend-item d-flex align-items-center gap-2">
            <div className="legend-color vip-seat"></div>
            <span>Свободно VIP ({vipPrice ?? "—"} руб)</span>
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
