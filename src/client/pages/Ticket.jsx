import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import ETicket from "../components/ETicket";
import "../styles/Ticket.css";

const Ticket = () => {
  const location = useLocation(); // получаем переданные на эту страницу данные //
  const navigate = useNavigate(); // (зачем написала - не помню,  может пригодиться)

  // Если пользователь попал на страницу напрямую, без данных — показываем сообщение //
  if (!location.state) {
    return (
      <Layout>
        <div className="ticket-page">
          <ClientHeader />
          <p className="text-white text-center mt-5">
            Нет данных для билета. Вернитесь к оплате.
          </p>
        </div>
      </Layout>
    );
  }

  // Извлекаем данные о билете из состояния маршрута //
  const {
    filmName,
    hallName,
    sessionTime,
    seats,
    price
  } = location.state;

  // Рендерим страницу с билетом //
  return (
    <Layout>
      <div className="ticket-page">
        <ClientHeader />

        {/* Электронный билет с переданными данными */}
        <ETicket
          movie={filmName}
          seats={seats}
          hall={hallName}
          startTime={sessionTime}
          price={price}
        />

      </div>
    </Layout>
  );
};

export default Ticket;
