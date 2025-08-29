import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import ETicket from "../components/ETicket";
import "../styles/Ticket.css";

const Ticket = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const {
    filmName,
    hallName,
    sessionTime,
    seats,
    price
  } = location.state;

  return (
    <Layout>
      <div className="ticket-page">
        <ClientHeader />
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
