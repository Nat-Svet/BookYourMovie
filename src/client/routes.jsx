import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MovieList from "./pages/MovieList";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/booking/:seanceId" element={<SeatSelection />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default ClientRoutes;
