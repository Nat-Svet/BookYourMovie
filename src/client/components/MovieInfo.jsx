import React from "react";
import "../styles/MovieInfo.css";

// Объявляем и экспортируем компонент MovieInfo //
// Принимает 3 пропса: название фильма, время сеанса и название зала //
export default function MovieInfo({ filmName, sessionTime, hallName }) {

  return (

    // Внешний контейнер с классом для стилизации //
    <div className="movie-info">
      <div className="movie-info__content">

        {/* Название фильма, если оно есть, иначе — "Фильм не выбран" */}
        <div className="movie-info__title">
          {filmName || "Фильм не выбран"}
        </div>

        {/* Время начала сеанса, если оно есть, иначе — "--:--" */}
        <div className="movie-info__session">
          Начало сеанса: {sessionTime || "--:--"}
        </div>

        {/* Название зала, если оно есть, иначе — "Зал не выбран" */}
        <div className="movie-info__hall">
          {hallName || "Зал не выбран"}
        </div>

      </div>
    </div>
  );
}

