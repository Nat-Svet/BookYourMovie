import React from "react";
import "../styles/MovieInfo.css";

export default function MovieInfo({ filmName, sessionTime, hallName }) {
  return (
    <div className="movie-info">
      <div className="movie-info__content">
        <div className="movie-info__title">
          {filmName || "Фильм не выбран"}
        </div>
        <div className="movie-info__session">
          Начало сеанса: {sessionTime || "--:--"}
        </div>
        <div className="movie-info__hall">
          {hallName || "Зал не выбран"}
        </div>

      </div>
    </div>
  );
}

