import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import MovieInfo from "../components/MovieInfo";
import CinemaHall from "../components/CinemaHall";
import Button from "../components/Button";
import "../styles/SeatSelection.css";

export default function SeatSelection() {
  const location = useLocation();
  const params = useParams();

  // Сохраняем параметры в локальное состояние
  const [seanceData, setSeanceData] = useState({
    filmName: null,
    sessionTime: null,
    hallName: null,
  });

  useEffect(() => {
    if (location.state) {
      const { filmName, sessionTime, hallName } = location.state;
      setSeanceData({ filmName, sessionTime, hallName });
    }
  }, [location.state]);

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

          <div className="cinema-hall-row">
            <CinemaHall seanceId={params.seanceId} />
          </div>

          <div className="button-row">
            <Button>Забронировать</Button>
          </div>
        </main>
      </div>
    </Layout>
  );
}
