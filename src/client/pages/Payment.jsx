import React from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import ClientHeader from '../components/ClientHeader';
import PaymentProcedure from '../components/PaymentProcedure';
import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();

  if (!location.state) {
    return (
      <Layout>
        <div className="paymentprocedure-wrapper">
          <ClientHeader />
          <p className="text-white text-center mt-5">
            Нет данных для оплаты. Вернитесь на страницу выбора мест.
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
      <div className="paymentprocedure-wrapper">
        <ClientHeader />
        <PaymentProcedure
          film={filmName}
          hall={hallName}
          sessionStart={sessionTime}
          seats={seats?.map(s => `Ряд ${s.row} место ${s.seat}`).join(', ')}
          price={price}
        />
      </div>
    </Layout>
  );
};

export default Payment;
