import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; 
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import MovieInfo from "../components/MovieInfo";
import CinemaHall from "../components/CinemaHall";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";
import API from "../../api/api";   // ✅ импорт API

import "../styles/SeatSelection.css";

const api = new API();

export default function SeatSelection() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 1199;
      setIsMobileOrTablet(isMobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Tooltip (зум)
  const [zoomed, setZoomed] = useState(false);
  const handleTooltipTap = useCallback(() => {
    setZoomed(prev => !prev);
  }, []);

  function handleCinemaZoomChange(newState) {
    setZoomed(newState);
  }

  // Состояние фильма и сеанса
  const [seanceData, setSeanceData] = useState({
    filmName: null,
    sessionTime: null,
    hallName: null,
  });

  // Состояние мест и суммы
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

  // 💰 Цены из CinemaHall
  const [prices, setPrices] = useState({ normal: 0, vip: 0 });

  useEffect(() => {
    if (location.state) {
      const { filmName, sessionTime, hallName } = location.state;
      setSeanceData({ filmName, sessionTime, hallName });
    }
  }, [location.state]);

  const handleSeatSelection = useCallback((seats, price) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  }, []);

  // ✅ Бронирование с запросом на сервер
  const handleBook = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const seanceId = location.state?.seanceId || params.seanceId;
      const ticketDate =
        location.state?.sessionDate || new Date().toISOString().split("T")[0];

      const tickets = selectedSeats.map((seat) => ({
        row: Number(seat.row),
        place: Number(seat.seat),
        coast: Number(seat.type === "vip" ? prices.vip : prices.normal),
      }));

      const payload = { seanceId, ticketDate, tickets };

      console.log("Выбранные места (selectedSeats):", selectedSeats);
      console.log("📤 Отправляем бронь (payload):", JSON.stringify(payload, null, 2));

      const response = await api.buyTicketsClient(seanceId, ticketDate, tickets);

      console.log("✅ Ответ от сервера:", response);

      setSuccessMessage("✅ Билеты успешно забронированы!");

      // Переход на страницу оплаты
      navigate("/payment", {
        state: {
          filmName: seanceData.filmName,
          sessionTime: seanceData.sessionTime,
          hallName: seanceData.hallName,
          seats: selectedSeats,
          price: totalPrice,
        },
      });
    } catch (error) {
      console.error("❌ Ошибка бронирования:", error);
      alert("Не удалось забронировать места: " + error.message);
    }
  };

  return (
    <Layout>
      <div className="seat-selection-page">
        {/* Хэддер */}
        <div className="client-header">
          <ClientHeader />
        </div>

        <main className="content">
          {/* Инфо о фильме */}
          <div className="movie-info-row">
            <MovieInfo
              filmName={seanceData.filmName}
              sessionTime={seanceData.sessionTime}
              hallName={seanceData.hallName}
            />
          </div>

          {/* Зал + Tooltip */}
          <div className="cinema-hall-row position-relative">
            <CinemaHall
              seanceId={location.state?.seanceId || params.seanceId}
              sessionDate={
                location.state?.sessionDate ||
                new Date().toISOString().split("T")[0]
              }
              onSelectionChange={handleSeatSelection}
              onPricesLoad={setPrices}
              zoomed={zoomed}
              isMobileOrTablet={isMobileOrTablet}
            />

            {isMobileOrTablet && <Tooltip onDoubleTap={handleTooltipTap} />}
          </div>

          {/* Кнопка брони */}
          <div className="button-row">
            <Button onClick={handleBook} disabled={selectedSeats.length === 0}>
              Забронировать
            </Button>

            {successMessage && (
              <div className="text-success text-center mt-3 fw-bold">
                {successMessage}
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}
