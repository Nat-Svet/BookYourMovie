import React, { useEffect, useState } from "react"; //импорт нужных модулей react //
import { useLocation, useParams } from "react-router-dom"; //импорт хуков для маршрутизации //
import "bootstrap/dist/css/bootstrap.min.css"; //импорт стилей Bootstrap //
import "../styles/CinemaHall.css"; // стили //

//основной компонент кинозала //
export default function CinemaHall({
  seanceId: propSeanceId, // ID сеанса из пропсов //
  sessionDate: propSessionDate, // Дата сеанса из пропсов //
  onSelectionChange, // Колбэк при изменении выбора мест //
}) {
  const location = useLocation(); // Хук для получения текущего местоположения (URL) //
  const { seanceId: seanceIdFromParams } = useParams(); // Хук для получения параметров из URL (включая seanceId) //

  const seanceId = propSeanceId || seanceIdFromParams || null; // Определяем ID сеанса: сначала пропсы, затем параметры URL, затем null //
  const sessionDate = propSessionDate || new Date().toISOString().split("T")[0]; // Определяем дату сеанса: сначала пропсы, затем текущая дата //

  const [seatMap, setSeatMap] = useState([]); // Состояние для хранения схемы мест в зале //
  const [selected, setSelected] = useState([]);  // Состояние для хранения выбранных мест (массив ID мест) //
  const [loading, setLoading] = useState(true);  // Состояние загрузки данных //
  const [error, setError] = useState(null); // Состояние для хранения ошибок //
  const [standardPrice, setStandardPrice] = useState(null);  // Состояние для стандартной цены билета //
  const [vipPrice, setVipPrice] = useState(null); // Состояние для VIP цены билета //

  // Загружаем данные о конфигурации зала и ценах //
  useEffect(() => {
    
    let ignore = false; // Не обновляем состояние, если компонент больше не на экране //

    // Асинхронная функция загрузки данных //
    async function load() {
      // Проверка наличия необходимых данных //
      if (!seanceId || !sessionDate) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

         // 1) Загружаем конфигурацию зала //
        const res = await fetch(
          `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${sessionDate}`
        );
        if (!res.ok) throw new Error("Не удалось загрузить конфигурацию зала");

        const json = await res.json();
        // Нормализацуем данные конфигурации зала //
        const cfg = Array.isArray(json) ? json : Array.isArray(json.result) ? json.result : [];
        if (!ignore) setSeatMap(cfg);

        // 2) Загружаем общие данные (для получения цен) //
        const resAll = await fetch("https://shfe-diplom.neto-server.ru/alldata");
        if (!resAll.ok) throw new Error("Не удалось загрузить данные о зале");

        const allData = await resAll.json();
        const { halls, seances } = allData?.result || {};
        if (!Array.isArray(seances)) throw new Error("Некорректные данные сеансов");
        if (!Array.isArray(halls)) throw new Error("Некорректные данные залов");

        // Ищем  информацию о текущем сеансе //
        const foundSeance = seances.find((s) => s.id === Number(seanceId));
        if (!foundSeance) throw new Error("Сеанс не найден");

        const foundHall = halls.find((h) => h.id === foundSeance.seance_hallid);
        if (!foundHall) throw new Error("Зал не найден");

        // Установливаем цены //
        if (!ignore) {
          setStandardPrice(foundHall.hall_price_standart);
          setVipPrice(foundHall.hall_price_vip);
        }
      } catch (e) {
         // Обработка ошибок //
        if (!ignore) setError(e.message || "Ошибка загрузки схемы зала");
      } finally {
        // Завершение загрузки //
        if (!ignore) setLoading(false);
      }
    }

    // Вызов функции загрузки //
    load();
    //  Отменяем все будущие обновления, когда компонент удаляется //
    return () => {
      ignore = true;
    };
  }, [seanceId, sessionDate]); // Зависимости эффекта //

  // Считаем выбранные места и сумму и сообщаем родителю //
  useEffect(() => {
    // Проверка наличия необходимых данных //
    if (!seatMap.length || standardPrice == null || vipPrice == null) return;

    // Формирование информации о выбранных местах //
    const selectedSeats = selected.map((id) => {
      const [row, col] = id.split("-").map(Number);
      return { row: row + 1, seat: col + 1, type: seatMap[row]?.[col] };
    });

    // Расчет общей стоимости выбранных мест
    const totalPrice = selectedSeats.reduce(
      (sum, s) => sum + (s.type === "vip" ? vipPrice : standardPrice),
      0
    );

    // Вызов колбэка с информацией о выборе //
    onSelectionChange?.(selectedSeats, totalPrice);
  }, [selected, seatMap, standardPrice, vipPrice, onSelectionChange]);

   // Обработчик выбора места //
  function handleSelect(row, col) {
    const type = seatMap?.[row]?.[col];
    // Игнорируем клики на заблокированные или занятые места //
    if (type === "disabled" || type === "taken") return;
    // Формирование ID места //
    const id = `${row}-${col}`;
     // Добавляем или удаляем места из выбранных //
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  // Отображение состояния загрузки //
  if (loading) {
    return (
      <div className="container py-3 bg-dark text-white cinema-hall-container">
        Загрузка схемы зала...
      </div>
    );
  }

  // Отображение ошибки //
  if (error) {
    return (
      <div className="container py-3 bg-dark text-white cinema-hall-container">
        Ошибка: {error}
      </div>
    );
  }

   // Основной рендеринг компонента //
  return (
    <div className="container py-3 bg-dark text-white cinema-hall-container">
      <div className="row justify-content-center mb-3"> {/* Блок экрана */}
        <div className="col-auto screen text-center">Экран</div>
      </div>

 {/* Рендеринг рядов и мест */}
      {seatMap.map((row, rowIndex) => (
        <div key={rowIndex} className="row justify-content-center seat-row">
          {row.map((seatType, seatIndex) => {
             // Пропуск отключенных мест //
            if (seatType === "disabled") {
              return <div key={seatIndex} className="col-auto seat empty-seat" />;
            }

             // Формирование ID места //
            const seatId = `${rowIndex}-${seatIndex}`;
             // Определение классов для кнопки места //
            let seatClass = "seat btn btn-sm rounded-0";

             // Добавление классов в зависимости от типа места //
            if (seatType === "vip") seatClass += " vip-seat";
            else if (seatType === "taken") seatClass += " busy-seat";
            else seatClass += " btn-light free-seat";

            // Добавление класса для выбранных мест //
            if (selected.includes(seatId)) {
              seatClass = "seat btn btn-sm rounded-0 btn-info selected-seat";
            }

             // Рендеринг кнопки места //
            return (
              <div key={seatIndex} className="col-auto p-0">
                <button
                  className={seatClass}
                  onClick={() => handleSelect(rowIndex, seatIndex)}
                  title={`Ряд ${rowIndex + 1}, место ${seatIndex + 1}`}
                  type="button"
                  disabled={seatType === "taken"} // Блокировка занятых мест //
                >
                  {/*{seatIndex + 1}  Отображение номера места */}
                </button>
              </div>
            );
          })}
        </div>
      ))}

       {/* Легенда для пояснения цветов мест */}
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
