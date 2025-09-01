import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import MovieInfo from "../components/MovieInfo";
import CinemaHall from "../components/CinemaHall";
import Button from "../components/Button";
import Tooltip from "../components/Tooltip";

import "../styles/SeatSelection.css";

export default function SeatSelection() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  const [seanceData, setSeanceData] = useState({
    filmName: null,
    sessionTime: null,
    hallName: null,
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (location.state) {
      const { filmName, sessionTime, hallName } = location.state;
      setSeanceData({ filmName, sessionTime, hallName });
    }
  }, [location.state]);

  // Мемоизируем, чтобы не менять ссылку колбэка на каждом рендере
  const handleSeatSelection = useCallback((seats, price) => {
    setSelectedSeats(seats);
    setTotalPrice(price);
  }, []);

  const handleBook = () => {
    if (selectedSeats.length === 0) return;
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

  return (
    <Layout>
      <div className="seat-selection-page">
        <div className="client-header">
          <ClientHeader />
        </div>
        <main className="content">
          <div className="movie-info-row">
            <MovieInfo
              filmName={seanceData.filmName}
              sessionTime={seanceData.sessionTime}
              hallName={seanceData.hallName}
            />
          </div>

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
