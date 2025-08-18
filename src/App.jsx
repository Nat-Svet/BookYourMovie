// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./admin/routes";
import SeatSelection from "./client/pages/SeatSelection";
import MovieList from "./client/pages/MovieList";
import Payment from "./client/pages/Payment";
import Ticket from "./client/pages/Ticket";
import Login from "./admin/pages/Login";
import AdminPage from "./admin/pages/AdminPage";

const App = () => {
  return (
    <Routes>
      {/* Админские маршруты */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/page" element={<AdminPage />} />

      {/* Клиентские маршруты */}
      <Route path="/select" element={<SeatSelection />} />
      <Route path="/movies" element={<MovieList />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/ticket" element={<Ticket />} />
    </Routes>
  );
};

export default App;
