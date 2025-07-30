import React from "react";
import Tooltip from './Tooltip';
import "../styles/MovieInfo.css";

export default function MovieInfo() {
  return (
    <div className="movie-info">
      <div className="movie-info__content">
        <div className="movie-info__title">
          Звёздные войны XXIII: Атака клонированных клонов
        </div>
        <div className="movie-info__session">
          Начало сеанса: 18:30
        </div>
        <div className="movie-info__hall">
          Зал 1
        </div>
      </div>
      <div className="movie-info__tooltip">
        <Tooltip />
      </div>
    </div>
  );
}