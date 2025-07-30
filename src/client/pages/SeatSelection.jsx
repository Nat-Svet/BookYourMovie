import React from "react";
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import MovieInfo from "../components/MovieInfo";
import CinemaHall from "../components/CinemaHall";
import Button from "../components/Button";
import "../styles/SeatSelection.css";

export default function SeatSelection() {
  return (
    <Layout>
      <div className="seat-selection-page">
        <div class="client-header">
          <ClientHeader />
        </div>
        <main className="content"> {/* состоит из трех рядов */}
          {/* Первый ряд — MovieInfo */}
          <div className="movie-info-row">
            <MovieInfo />
          </div>

          {/* Второй ряд — CinemaHall */}
          <div className="cinema-hall-row">
            <CinemaHall />
          </div>

          {/* Третий ряд — Button */}
          <div className="button-row">
            <Button>Забронировать</Button>
          </div>
        </main>
      </div>
    </Layout>
  );
}
