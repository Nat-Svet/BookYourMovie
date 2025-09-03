import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; // маршрутизация //
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import MovieInfo from "../components/MovieInfo";
import CinemaHall from "../components/CinemaHall";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";

import "../styles/SeatSelection.css";

export default function SeatSelection() {
  const location = useLocation(); // получаем данные, переданные через navigate(..., {state}) //
  const params = useParams(); // получаем параметры из URL (например seanceId) //
  const navigate = useNavigate(); // функция для перехода по другим страницам //

  // Состояние с данными о фильме и сеансе //
  const [seanceData, setSeanceData] = useState({
    filmName: null,
    sessionTime: null,
    hallName: null,
  });

  // Состояние для выбранных мест //
  const [selectedSeats, setSelectedSeats] = useState([]);
  // Состояние для общей суммы бронирования //
  const [totalPrice, setTotalPrice] = useState(0);

  // При первом рендере проверяем, есть ли данные в location.state //
  // и записываем их в seanceData //
  useEffect(() => {
    if (location.state) {
      const { filmName, sessionTime, hallName } = location.state;
      setSeanceData({ filmName, sessionTime, hallName });
    }
  }, [location.state]);

  // Функция для обработки выбора мест в зале //
  // useCallback используется, чтобы ссылка на функцию не менялась на каждом рендере //
  const handleSeatSelection = useCallback((seats, price) => {
    setSelectedSeats(seats); // сохраняем выбранные места //
    setTotalPrice(price); // сохраняем общую цену //
  }, []);

  // Функция бронирования (нажатие кнопки "Забронировать") //
  const handleBook = () => {
    if (selectedSeats.length === 0) return; // если мест не выбрано, ничего не делаем //
    // переходим на страницу оплаты и передаём туда данные //
    navigate("/payment", {
      state: {
        filmName: seanceData.filmName,
        sessionTime: seanceData.sessionTime,
        hallName: seanceData.hallName,
        seats: selectedSeats,
        price: totalPrice,
      },
    });
  };

  // Основной JSX //
  return (
    <Layout>
      <div className="seat-selection-page">

        {/* хэддер */}
        <div className="client-header">
          <ClientHeader />
        </div>

        <main className="content">

          {/* Блок с информацией о фильме и сеансе */}
          <div className="movie-info-row">
            <MovieInfo
              filmName={seanceData.filmName}
              sessionTime={seanceData.sessionTime}
              hallName={seanceData.hallName}
            />
          </div>

          {/* Зал с местами + подсказка (tooltip) */}
          <div className="cinema-hall-row position-relative">
            <CinemaHall
              seanceId={location.state?.seanceId || params.seanceId}
              sessionDate={
                location.state?.sessionDate || new Date().toISOString().split("T")[0]
              }
              onSelectionChange={handleSeatSelection}
            />
            <Tooltip />
          </div>

          {/* Кнопка бронирования */}
          <div className="button-row">
            <Button onClick={handleBook} disabled={selectedSeats.length === 0}>
              Забронировать
            </Button>
          </div>
        </main>
      </div>
    </Layout>
  );
}
