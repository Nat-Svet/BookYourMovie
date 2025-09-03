import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MovieList from "./pages/MovieList";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";

const ClientRoutes = () => {
  return (
    <Routes>

      {/* Главная страница — список фильмов */}
      <Route path="/" element={<MovieList />} />

      {/* Страница выбора мест для конкретного сеанса (id сеанса передаётся в URL) */}
      <Route path="/booking/:seanceId" element={<SeatSelection />} />

      {/* Страница оплаты */}
      <Route path="/payment" element={<Payment />} />

      {/* Страница билета после покупки */}
      <Route path="/ticket" element={<Ticket />} />

      {/* Любой неизвестный путь → редиректим на главную */}
      <Route path="/*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default ClientRoutes;
