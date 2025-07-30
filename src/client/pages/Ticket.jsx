import React from "react";
import Layout from "../components/Layout";
import ClientHeader from "../components/ClientHeader";
import ETicket from "../components/ETicket";
import "../styles/Ticket.css";

const Ticket = () => {
  const movie = "Звёздные войны XXIII: Атака клонированных клонов";
  const seats = [6, 7];
  const hall = 1;
  const startTime = "18:30";

  return (
    <Layout>
      <div className="ticket-page">

      <ClientHeader />
      
        <ETicket 
          movie={movie}
          seats={seats}
          hall={hall}
          startTime={startTime}
        />
        
      </div>
    </Layout>
  );
};

export default Ticket;
